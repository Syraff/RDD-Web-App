export default function InputText({
  title,
  type,
  name,
  handleChange,
  handleBlur,
  values,
  placeholder,
  errors,
}: any) {
  return (
    <div className="w-full mb-5">
      <p className="mb-2 capitalize">{title}</p>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values}
        placeholder={placeholder}
        className={
          (errors ? "border border-red-500" : "") +
          " w-full bg-[#fff] px-3 py-3 text-[#071123] rounded"
        }
      />
      <p className="text-red-400 text-xs mt-2">{errors}</p>
    </div>
  );
}
