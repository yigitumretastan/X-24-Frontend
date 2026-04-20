"use client";

import React from "react";

interface GenericFormProps<T> {
  schema: any; // Ideally use Zod or similar
  defaultValues: T;
  onSubmit: (data: T) => void;
  renderFields: (register: any, errors: any) => React.ReactNode;
}

export function GenericForm<T>({ 
  defaultValues, 
  onSubmit, 
  renderFields 
}: GenericFormProps<T>) {
  // Simple implementation for now, should use react-hook-form in production
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle submission logic
    }} className="space-y-4">
      {/* Implementation depends on chosen form library */}
    </form>
  );
}
