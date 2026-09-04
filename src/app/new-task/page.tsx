import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { NewTaskForm } from "@/components/tasks/NewTaskForm";

export const metadata = {
  title: "Nueva tarea — ARGUS",
};

export default function NewTaskPage() {
  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-3">
        <PageHeader
          title="Nueva tarea"
          description="Define un objetivo para que ARGUS lo evalúe mediante consenso multi-agente."
          breadcrumb={<Breadcrumb path="Gobernanza / Pipelines" id="ID: TSK-NEW" />}
        />
        <NewTaskForm />
      </div>
    </PageContainer>
  );
}
