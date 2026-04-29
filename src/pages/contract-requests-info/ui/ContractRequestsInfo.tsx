import { ContractRequestsList } from "@/features/contract-requests-list";
import { NavBar } from "@/widgets/navbar";

export const ContractRequestsInfo = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <NavBar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Заявки на интеграцию
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
              Мои заявки на формирование контрактов
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Здесь отображаются заявки, которые вы отправили на рассмотрение.
              Подробная информация по каждой заявке будет доступна на отдельной
              странице.
            </p>
          </div>
        </section>

        <ContractRequestsList />
      </main>
    </div>
  );
};
