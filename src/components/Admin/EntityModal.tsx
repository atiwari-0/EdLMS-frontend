'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { graphql } from "@/lib/graphql";
import type { EntityData, EntityType } from "../../types/admintypes";

interface EntityModalProps {
  type: EntityType;
  fields: (keyof EntityData)[];
  isOpen: boolean;
  initialData?: EntityData | null;
  onClose: () => void;
  onSubmit: (data: EntityData) => void;
}

export default function EntityModal({
  type,
  fields,
  isOpen,
  initialData = null,
  onClose,
  onSubmit,
}: EntityModalProps) {
  const [formData, setFormData] = useState<EntityData>({});
  const [classOptions, setClassOptions] = useState<{id: string, name: string}[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});

      const fetchOptions = async () => {
        try {
          if (type === 'Students' || type === 'Teachers') {
            const classes = await graphql<{ classes: {id: string, name: string}[] }>(`
              query { classes { id name } }
            `);
            setClassOptions(classes.classes);
          }

          if (type === 'Teachers') {
            const subjects = await graphql<{ subjects: {id: string, name: string}[] }>(`
              query { subjects { id name } }
            `);
            setSubjectOptions(subjects.subjects);
          }
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };

      fetchOptions();
    }
  }, [isOpen, type, initialData]);

  const handleChange = (field: keyof EntityData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Edit ${type.slice(0, -1)}` : `Create New ${type.slice(0, -1)}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => {
            if (field === 'classId') {
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <Select
                    value={formData.classId || ''}
                    onValueChange={(value) => handleChange('classId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }
            if (field === 'subjectId') {
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Select
                    value={formData.subjectId || ''}
                    onValueChange={(value) => handleChange('subjectId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }
            if (field === 'classIds') {
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">Classes</label>
                  <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-2">
                    {classOptions.map((cls) => (
                      <div key={cls.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.classIds?.includes(cls.id) || false}
                          onChange={(e) => {
                            const newIds = new Set(formData.classIds || []);
                            if (e.target.checked) {
                              newIds.add(cls.id);
                            } else {
                              newIds.delete(cls.id);
                            }
                            handleChange('classIds', Array.from(newIds));
                          }}
                        />
                        <span>{cls.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field}
                </label>
                <Input
                  value={(formData[field] as string) || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={`Enter ${field}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}