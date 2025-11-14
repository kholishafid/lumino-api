export const res = <T, E extends Record<string, any>>({
  status,
  message,
  data,
  ...rest
}: {
  status: "success" | "error" | "fail";
  message: string;
  data?: T;
  rest?: E;
}) => {
  return {
    status,
    message,
    data,
    ...rest,
  };
};
