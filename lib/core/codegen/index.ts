export function indent(depth: number, value: string, prefix = ""): string {
  return value
    .split("\n")
    .map((x) => prefix + " ".repeat(depth) + x)
    .join("\n");
}

export function blank(): string {
  return "";
}

type LinesOptions = {
  separator?: string;
  depth?: number;
  prefix?: string;
};

type ArrayOrString = Array<ArrayOrString> | string | null;

const defaultLinesOptions: LinesOptions = {
  separator: "",
  depth: 0,
};
export function lines(
  xs: Array<ArrayOrString>,
  { separator = "", depth = 0, prefix = "" }: LinesOptions = defaultLinesOptions
): string {
  return indent(
    depth,
    flatten<ArrayOrString>(xs)
      .filter((x): x is string => x !== null)
      .join(`${separator}\n`),
    prefix
  );
}

type NestedArray<T> = Array<NestedArray<T> | T>;
function flatten<T>(xs: NestedArray<T>): T[] {
  const output: T[] = [];
  for (const x of xs) {
    if (Array.isArray(x)) {
      output.push(...flatten(x));
    } else {
      output.push(x);
    }
  }

  return output;
}
