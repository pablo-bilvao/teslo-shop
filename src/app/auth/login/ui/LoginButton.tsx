import clsx from "clsx";
import { useFormStatus } from "react-dom";

export const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending,
      })}
    >
      {pending ? "Cargando..." : "Ingresar"}
    </button>
  );
};
