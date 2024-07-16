import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";
import CheckboxInput from "@/components/Forms/CheckboxInput";
import { signIn } from "next-auth/react";
import Input from "@/components/Forms/PrimeInput";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { Button } from "primereact/button";
import axios from "axios";
import { useToast } from "@/_context/ToastContext";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Λάθος format email")
    .required("Συμπληρώστε το email"),
  password: yup.string().required("Συμπληρώστε τον κωδικό"),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res.status === 200) {
        const { data } = await axios.post("/api/user/apiUser", {
          action: "findRole",
          email: formData.email,
        });
        if (!data.success) {
          throw new Error(data.message);
        }
        showMessage({
          severity: "success",
          summary: "Επιτυχία",
          message: "Επιτυχής σύνδεση",
        });
        router.push("/dashboard");
      } else {
        showMessage({
          severity: "error",
          summary: "Αποτυχία",
          message: "Λάθος email ή κωδικός",
        });
      }
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Αποτυχία",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_layout">
      <div className="form_container">
        <div className="flex flex-column mb-4 ">
          <h2>Σύνδεση Χρήστης!</h2>
          <p>Συμπληρώστε τη φόρμα σύνδεσης</p>
        </div>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={"email"}
            name={"email"}
            mb={"10px"}
            required
            control={control}
            error={errors.email}
          />
          <PrimeInputPass
            label={"Κωδικός"}
            name={"password"}
            mb={"10px"}
            required
            control={control}
            error={errors.password}
          />
          <div className="form_flexBetween">
            {/* <CheckboxInput label={"Αποθήκευση κωδικού"} /> */}
            <Link className="linkBtn" href="/auth/reset-password">
              Αλλαγή κωδικού
            </Link>
          </div>
          <Button
            className="w-full"
            type="submit"
            label="Σύνδεση"
            loading={loading}
          />
          <div className="form_divider"></div>
          <div className="form_centerDiv">
            <Link className="linkBtn" href="/auth/register">
              Δημιουργία Λογαριασμού
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
