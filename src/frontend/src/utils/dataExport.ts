import type { UserDataView } from "../backend";

export function downloadUserData(data: UserDataView, userName: string): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `tranquil-data-${userName.replace(/\s+/g, "-").toLowerCase()}-${timestamp}.json`;

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: userName,
    ...data,
  };

  const blob = new Blob(
    [
      JSON.stringify(
        exportData,
        (_, v) => (typeof v === "bigint" ? v.toString() : v),
        2,
      ),
    ],
    {
      type: "application/json",
    },
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
