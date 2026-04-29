import { ContractRequestInfo } from "@/features/contract-request-info";
import { NavBar } from "@/widgets/navbar";
import { Link, useParams } from "react-router";
import { Button, Routes } from "@/shared";

export const ContractRequest = () => {
  const { contractRequestId } = useParams();

  const parsedRequestId = Number(contractRequestId);

  if (!contractRequestId || Number.isNaN(parsedRequestId)) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavBar />

        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
          <section className="rounded-2xl border bg-background p-8 shadow-sm">
            <h1 className="text-3xl font-semibold">Некорректный ID заявки</h1>

            <p className="mt-3 text-muted-foreground">
              Проверьте ссылку или вернитесь к списку заявок.
            </p>

            <Button asChild className="mt-6">
              <Link to={Routes.CONTRACT_REQUESTS}>К списку заявок</Link>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NavBar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Подробная информация
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
              Заявка #{parsedRequestId}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Здесь отображаются сведения о заявке, запрошенных операциях,
              результате рассмотрения и сформированном контракте, если заявка
              была одобрена.
            </p>
          </div>
        </section>

        <ContractRequestInfo requestId={parsedRequestId} />
      </main>
    </div>
  );
};
