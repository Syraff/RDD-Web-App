import api from "@/api/api";
import Input from "@/components/input/InputText";
import { Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LoginForm() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (val: any) => {
    try {
      const { data } = await api.post("/users/login", val);

      localStorage.setItem("token", data.token);
      // localStorage.setItem("device_token", data.device_token);
      // localStorage.setItem("role", data.role);
      // localStorage.setItem("name", data.name);
      // localStorage.setItem("userId", data.userId);
      toast.success("Berhasil Login");

      setTimeout(() => {
        navigate("/demo");
      }, 1000);
    } catch (errors: any) {
      toast.error(errors.response.data.errors[0].message);
      console.log(errors);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Email wajib di isi!";
          }
          if (!values.password) {
            errors.password = "Password wajib di isi!";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setTimeout(() => {
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Input
              title="Email"
              name="email"
              type="email"
              handleChange={handleChange}
              handleBlur={handleBlur}
              values={values.email}
              placeholder="Masukkan email..."
              errors={errors.email && touched.email && errors.email}
            />
            <div className="w-full mb-5">
              <p className="mb-2">Password</p>
              <div className="relative">
                <input
                  type={!show ? "password" : "text"}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Masukkan password..."
                  className={
                    (errors.password && touched.password && errors.password
                      ? "border border-red-500"
                      : "") +
                    " w-full bg-[#fff] px-3 py-3 text-[#1a1a1a] rounded"
                  }
                />
                {!show ? (
                  <Eye
                    className="absolute top-[25%] right-5 z-50 text-[#1a1a1a] cursor-pointer"
                    onClick={() => setShow(true)}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-[25%] right-5 z-50 text-[#1a1a1a] cursor-pointer"
                    onClick={() => setShow(false)}
                  />
                )}
              </div>
              <p className="text-red-400 text-xs mt-2">
                {errors.password && touched.password && errors.password}
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-center bg-[#fff] text-[#1a1a1a] rounded mt-10 cursor-pointer disabled:bg-[#fff]/50 font-semibold"
            >
              Login
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}
