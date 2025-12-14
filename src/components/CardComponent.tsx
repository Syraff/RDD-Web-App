import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardComponentProps {
  title: string;
  value: number;
}

export default function CardComponent({ title, value }: CardComponentProps) {
  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="capitalize">{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
