'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { EntityData, EntityType } from "../../types/admintypes";

interface EntityTableProps {
  type: EntityType;
  fields: (keyof EntityData)[];
  data: EntityData[];
  isLoading: boolean;
  onEdit: (item: EntityData) => void;
  onDelete: (id: string) => void;
}

export default function EntityTable({
  type,
  fields,
  data,
  isLoading,
  onEdit,
  onDelete,
}: EntityTableProps) {
  const getDisplayValue = (field: keyof EntityData, value: unknown): string => {
    if (field === 'classIds' || field === 'classNames') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return '-';
    }
    
    if (value === null || value === undefined) {
      return '-';
    }
    
    return String(value);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center">No {type.toLowerCase()} found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">{type}</h2>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[400px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background">
            <tr>
              {fields.map((field) => (
                <th key={field} className="px-4 py-2 text-left capitalize">
                  {field}
                </th>
              ))}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-muted/50">
                {fields.map((field) => (
                  <td key={`${item.id}-${field}`} className="px-4 py-2">
                    {getDisplayValue(field, item[field])}
                  </td>
                ))}
                <td className="px-4 py-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => item.id && onDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}