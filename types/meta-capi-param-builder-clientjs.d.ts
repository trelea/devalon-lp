declare module "meta-capi-param-builder-clientjs" {
  interface ClientParamBuilder {
    processAndCollectAllParams(
      url: string | null,
      getIpFn?: () => string | Promise<string>
    ): Promise<Record<string, string>>;
    getFbc(): string;
    getFbp(): string;
    getClientIpAddress(): string;
    getNormalizedAndHashedPII(value: string, dataType: string): string | null;
  }

  const clientParamBuilder: ClientParamBuilder;
  export default clientParamBuilder;
}
