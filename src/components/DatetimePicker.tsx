import { DatePicker } from "antd";
import en from "antd/es/date-picker/locale/en_US";
import dayjs, { Dayjs } from "dayjs";

export default function DatetimePicker({
  setFieldValue,
  values,
  errors,
  name,
}: any) {
  const buddhistLocale: typeof en = {
    ...en,
    lang: {
      ...en.lang,
      fieldDateFormat: "YYYY-MM-DD",
      fieldDateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      yearFormat: "YYYY",
      cellYearFormat: "YYYY",
    },
  };
  return (
    <DatePicker
      className={`w-full ${errors && "border !border-red-500"}`}
      style={{ padding: "10px" }}
      value={values ? dayjs(values) : null}
      showTime
      name={name}
      locale={buddhistLocale}
      onChange={(value: Dayjs | null) => {
        setFieldValue(name, value ? value.toDate() : null);
      }}
      getPopupContainer={(trigger) => trigger.parentElement!}
    />
  );
}
