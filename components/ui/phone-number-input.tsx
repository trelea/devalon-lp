"use client"

import * as React from "react"
import ct from "countries-and-timezones"
import i18nIsoCountries from "i18n-iso-countries"
import enCountries from "i18n-iso-countries/langs/en.json"
import {
  type CountryCallingCode,
  type E164Number,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
} from "libphonenumber-js"
import examples from "libphonenumber-js/mobile/examples"
import { Check, ChevronsUpDown } from "lucide-react"
import PhoneInput, { type Country } from "react-phone-number-input/input"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

i18nIsoCountries.registerLocale(enCountries)

type CountryOption = {
  value: Country
  label: string
  indicatif: CountryCallingCode
}

function isoToEmoji(code: string) {
  return code.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  )
}

// example number with its digits zeroed, used as a format-hinting placeholder
function replaceNumbersWithZeros(formatted: string) {
  return formatted.replace(/\d/g, "0")
}

const countryOptions: CountryOption[] = getCountries()
  .map((country) => ({
    value: country,
    label: i18nIsoCountries.getName(country, "en") ?? country,
    indicatif: `+${getCountryCallingCode(country)}` as CountryCallingCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

// where the device currently is, from its timezone (e.g. "Europe/Chisinau"
// → MD) — no network involved, and OS clocks follow the visitor when they
// travel
function timezoneCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz ? ct.getCountryForTimezone(tz)?.id : undefined
  } catch {
    return undefined
  }
}

// offline fallback from the browser locale (e.g. "ro-MD" → MD)
function localeCountry() {
  try {
    for (const lang of navigator.languages ?? []) {
      const region = new Intl.Locale(lang).region
      if (region) return region
    }
  } catch {
    // older browsers without Intl.Locale — fall through
  }
  return undefined
}

export function PhoneNumberInput({
  id,
  name = "phone",
  defaultCountry = "DK",
  className,
  inputClassName,
}: {
  id?: string
  name?: string
  defaultCountry?: Country
  className?: string
  inputClassName?: string
}) {
  const [country, setCountry] = React.useState<CountryOption>(
    () =>
      countryOptions.find((option) => option.value === defaultCountry) ??
      countryOptions[0]
  )
  const [phoneNumber, setPhoneNumber] = React.useState<E164Number>()
  const [open, setOpen] = React.useState(false)
  // once the visitor picks a country or starts typing, detection must not
  // override their choice
  const touchedRef = React.useRef(false)

  // in an effect (not initial state) so the server-rendered markup stays
  // deterministic — the server would otherwise resolve its own timezone
  React.useEffect(() => {
    if (touchedRef.current) return
    const code = timezoneCountry() ?? localeCountry()
    if (!code) return
    const option = countryOptions.find(
      (candidate) => candidate.value === code.toUpperCase()
    )
    if (option) setCountry(option)
  }, [])

  const example = getExampleNumber(country.value, examples)
  const placeholder = example
    ? replaceNumbersWithZeros(example.formatInternational())
    : "Phone number (optional)"

  const invalid = !!phoneNumber && !isValidPhoneNumber(phoneNumber)

  return (
    <div
      className={cn(
        "flex items-center gap-1 border-b border-border transition-colors focus-within:border-primary",
        className
      )}
    >
      {/* modal so the list stays scrollable inside the contact dialog
          (the dialog's scroll lock otherwise swallows wheel/touch events
          on portaled content) */}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label={`Country: ${country.label} (${country.indicatif})`}
            className="h-12 shrink-0 gap-1 rounded-none border-0 bg-transparent px-1.5 font-normal shadow-none hover:bg-transparent"
          >
            <span className="text-base leading-none">
              {isoToEmoji(country.value)}
            </span>
            <ChevronsUpDown
              className="size-3.5 text-muted-foreground/70"
              aria-hidden
            />
          </Button>
        </PopoverTrigger>
        {/* z-[80] keeps the list above the contact dialog (overlay z-60, content z-70);
            data-lenis-prevent keeps smooth-scroll from hijacking the list's wheel events */}
        <PopoverContent className="z-[80] w-72 p-0" align="start" data-lenis-prevent>
          <Command>
            <CommandInput placeholder="Find your country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.indicatif}`}
                    onSelect={() => {
                      touchedRef.current = true
                      setPhoneNumber(undefined)
                      setCountry(option)
                      setOpen(false)
                    }}
                  >
                    <span aria-hidden>{isoToEmoji(option.value)}</span>
                    <span className="flex-1 truncate">{option.label}</span>
                    <span className="text-muted-foreground">
                      {option.indicatif}
                    </span>
                    <Check
                      className={cn(
                        "size-4",
                        option.value === country.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <PhoneInput
        international
        withCountryCallingCode
        country={country.value}
        value={phoneNumber}
        onChange={(value) => {
          if (value) touchedRef.current = true
          setPhoneNumber(value)
        }}
        inputComponent={Input}
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete="tel"
        aria-invalid={invalid || undefined}
        className={inputClassName}
      />
    </div>
  )
}
