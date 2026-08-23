"use client";

import { content } from "@/lib/content";
import { Gate } from "@/components/admin/gate";
import { AdminApp } from "@/components/admin/admin-app";

export default function AdminPage() {
  return (
    <Gate>
      <AdminApp base={content} />
    </Gate>
  );
}
