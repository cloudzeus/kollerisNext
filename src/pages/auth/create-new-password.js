import {useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "primereact/button";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { useToast } from "@/_context/ToastContext";

const registerSchema = yup.object().shape({
  password: yup
    .string()
    .required("Συμπληρώστε τον κωδικό")
    .min(5, "Tουλάχιστον 5 χαρακτήρες")
    .max(15, "Μέχρι 15 χαρακτήρες"),
  passwordConfirm: yup
    .string()
    .required("Συμπληρώστε τον κωδικό")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const CreateNewPassword = () => {
  const { showMessage } = useToast();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
        password: "",
        passwordConfirm: "",
    },
    resolver: yupResolver(registerSchema),
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/resetPassword", {
        password: formData,
        email: router.query.email,
        action: "finalReset",
      });
        showMessage({
          severity: "success",
          summary: "Επιτυχία",
          message: data.message,
        });
        router.push("/auth/signin");
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Αποτυχία",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setLoading(false);
      reset();
    }
  };
  return (
    <div className="login_layout">
        <div className="form_container">
        <Button
              onClick={() => router.push("/auth/signin")}
              className='back_button '  
              severity='secondary'
              icon="pi pi-arrow-left"
            />
        <h1 className="primaryHeader">ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ</h1>
        <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <PrimeInputPass
            label={"Κωδικός"}
            name={"password"}
            mb={"10px"}
            required
            control={control}
            error={errors.password}
          />
          <PrimeInputPass
            label={"Eπιβεβαίωση"}
            name={"passwordConfirm"}
            mb={"20px"}
            required
            control={control}
            error={errors.passwordConfirm}
          />
          <Button
            type="submit"
            label="Αποστολή"
            loading={loading}
            style={{ width: "100%" }}
          />
        </form>
      </div>
    </div>
  );
};


export default CreateNewPassword;
