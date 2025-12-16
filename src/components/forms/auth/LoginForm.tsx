import api from "@/api/api";
import Input from "@/components/input/InputText";
import { Spinner } from "@/components/ui/spinner";
import { Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LoginForm() {
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (val: any) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/users/login", val);

      localStorage.setItem("token", data.token);
      // localStorage.setItem("device_token", data.device_token);
      localStorage.setItem("role", data.user.roles);
      localStorage.setItem("name", data.user.fullName);
      // localStorage.setItem("userId", data.userId);
      toast.success("Berhasil Login");

      setTimeout(() => {
        navigate("/monitor");
      }, 1000);
    } catch (errors: any) {
      toast.error(errors.response.data.errors[0].message);
      console.log(errors);
    } finally {
      setIsLoading(false);
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
                    " w-full bg-[#fff] px-3 py-3 text-[#071123] rounded"
                  }
                />
                {!show ? (
                  <Eye
                    className="absolute top-[25%] right-5 z-50 text-[#071123] cursor-pointer"
                    onClick={() => setShow(true)}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-[25%] right-5 z-50 text-[#071123] cursor-pointer"
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
              disabled={isLoading}
              className={`w-full py-3 text-center text-[#071123] rounded mt-10 cursor-pointer font-semibold ${
                isLoading ? "border-white border text-white" : "bg-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-x-2">
                  <Spinner />
                  <p className="font-semibold text-sm">Loading...</p>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}
