"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Input from "@/components/Forms/PrimeInput";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { Button } from "primereact/button";
import { useToast } from "@/_context/ToastContext";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Συμπληρώστε το όνομα"),
  lastName: yup.string().required("Συμπληρώστε το επώνυμο"),
  email: yup
    .string()
    .email("Λάθος format email")
    .required("Συμπληρώστε το email"),
  password: yup.string().required("Συμπληρώστε τον κωδικό"),
});

const RegisterPage = () => {
  const { showMessage } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      	const { data } = await axios.post("/api/user/registeruser", formData);
		if(data.success){
			showMessage({
				severity: "success",
				summary: "Επιτυχία",
				message: data.message,
			});
			router.push("/auth/thankyouregistration")
		} else {
			showMessage({
				severity: "error",
				summary: "Αποτυχία",
				message: data.message,
			});
		}
	 
    } catch (error) {
      showMessage({
        severity: "error",
        summary: "Αποτυχία",
		    message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login_layout">
      <div className="form_container">
        <div className="flex flex-column mb-4 ">
            <h2>EΓΓΡΑΦΗ ΧΡΗΣΤΗ!</h2>
            <p>Συμπληρώστε τη φόρμα εγγραφής</p>
        </div>
        <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={"Όνομα"}
            name={"firstName"}
            mb={"10px"}
            required
            control={control}
            error={errors.firstName}
          />
          <Input
            label={"Επώνυμο"}
            name={"lastName"}
            mb={"10px"}
            required
            control={control}
            error={errors.lastName}
          />
          <Input
            label={"email"}
            name={"email"}
            type="email"
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
          <Button
            loading={loading}
            type="submit"
            label="Εγγραφή"
            // onClick={onSubmit}
          />
        </form>
        <div className="form_divider"></div>
        <div className="form_centerDiv">
          <Link className="linkBtn" href="/auth/signin">
            Έχετε ήδη λογαριασμό
          </Link>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;
