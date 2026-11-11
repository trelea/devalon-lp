"use client";

import * as React from "react";
import { track } from "@/lib/tracking";

export interface FormTrackingHandlers {
  onFocus: (field: string) => void;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onError: (reason: string) => void;
  onSuccess: () => void;
}

export function useFormTracking(formName: string): FormTrackingHandlers {
  const startedRef = React.useRef(false);
  const focusedRef = React.useRef<Set<string>>(new Set());
  const timersRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const onFocus = React.useCallback(
    (field: string) => {
      if (!startedRef.current) {
        startedRef.current = true;
        track("form_start", { form: formName }, undefined, {
          server: false,
        }).catch(() => {});
      }
      if (!focusedRef.current.has(field)) {
        focusedRef.current.add(field);
        track("form_field_focus", { form: formName, field }, undefined, {
          server: false,
        }).catch(() => {});
      }
    },
    [formName]
  );

  const onChange = React.useCallback(
    (field: string, value: string) => {
      if (timersRef.current[field]) clearTimeout(timersRef.current[field]);
      timersRef.current[field] = setTimeout(() => {
        track(
          "form_field_change",
          {
            form: formName,
            field,
            value_length: value.length,
            has_value: value.trim().length > 0,
          },
          undefined,
          { server: false }
        ).catch(() => {});
      }, 600);
    },
    [formName]
  );

  const onSubmit = React.useCallback(() => {
    track("form_submit", { form: formName }, undefined, {
      server: false,
    }).catch(() => {});
  }, [formName]);

  const onError = React.useCallback(
    (reason: string) => {
      track(
        "form_error",
        { form: formName, reason: reason?.slice?.(0, 120) },
        undefined,
        { server: false }
      ).catch(() => {});
    },
    [formName]
  );

  const onSuccess = React.useCallback(() => {
    // Lead conversion is fired separately with PII at the call site.
  }, []);

  return { onFocus, onChange, onSubmit, onError, onSuccess };
}