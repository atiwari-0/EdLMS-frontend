'use client';

import { useEffect, useState } from 'react';
import EntityModal from './EntityModal';
import EntityTable from './EntityTable';
import { graphql } from '@/lib/graphql';
import type { EntityData, EntityType } from '../../types/admintypes';

interface EntitySectionProps {
  title: EntityType;
  fetchQuery: string;
  createMutation: string;
  updateMutation: string;
  deleteMutation: string;
  fields: (keyof EntityData)[];
}

type GraphQLResponse<T> = Record<string, T[]>;

interface StudentResponse {
  id: string;
  user?: { name: string; email: string };
  class?: { id: string; name: string };
}

interface TeacherResponse {
  id: string;
  user?: { name: string; email: string };
  subject?: { id: string; name: string };
  classes?: { id: string; name: string }[];
}

interface ClassResponse {
  id: string;
  name: string;
}

interface SubjectResponse {
  id: string;
  name: string;
}

export default function EntitySection({
  title,
  fetchQuery,
  createMutation,
  updateMutation,
  deleteMutation,
  fields,
}: EntitySectionProps) {
  const [items, setItems] = useState<EntityData[]>([]);
  const [selectedItem, setSelectedItem] = useState<EntityData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await graphql<GraphQLResponse<StudentResponse | TeacherResponse | ClassResponse | SubjectResponse>>(fetchQuery);
        const key = Object.keys(data)[0];
        const rawItems = data[key];

        const parsedItems = rawItems.map((item) => {
          if (title === 'Students') {
            const student = item as StudentResponse;
            return {
              id: student.id,
              name: student.user?.name ?? '',
              email: student.user?.email ?? '',
              classId: student.class?.id ?? '',
              className: student.class?.name ?? '',
            };
          } else if (title === 'Teachers') {
            const teacher = item as TeacherResponse;
            return {
              id: teacher.id,
              name: teacher.user?.name ?? '',
              email: teacher.user?.email ?? '',
              subjectId: teacher.subject?.id ?? '',
              subjectName: teacher.subject?.name ?? '',
              classIds: teacher.classes?.map(cls => cls.id) ?? [],
              classNames: teacher.classes?.map(cls => cls.name) ?? [],
            };
          } else {
            const basicItem = item as ClassResponse | SubjectResponse;
            return {
              id: basicItem.id,
              name: basicItem.name,
            };
          }
        });
        setItems(parsedItems);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchQuery, title]);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: EntityData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!deleteMutation) {
      console.warn('Delete mutation not provided');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    try {
      await graphql(deleteMutation, { id });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (formData: EntityData) => {
  try {
    const isEditing = !!selectedItem;
    const mutation = isEditing ? updateMutation : createMutation;
    
    if (!mutation) {
      console.warn(isEditing ? 'Update mutation not provided' : 'Create mutation not provided');
      return;
    }

    const input = buildInputData(title, formData);
    const result = await graphql<Record<string, any>>(mutation, { input });


    if (isEditing) {
      const key = Object.keys(result)[0];
      const updatedItem = transformResponseData(title, result[key]);
      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    } else {
      const responseKey = Object.keys(result)[0];
      const createdItem = transformResponseData(title, result[responseKey] || result);
      setItems(prev => [...prev, createdItem]);
    }

    setIsModalOpen(false);
  } catch (error) {
    console.error('Submit error:', error);
  }
};

  const displayFields = fields.map(field => {
    if (field === 'classId') return 'className';
    if (field === 'subjectId') return 'subjectName';
    if (field === 'classIds') return 'classNames';
    return field;
  }) as (keyof EntityData)[];

  return (
    <div className="p-4 border rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add {title}
        </button>
      </div>

      <EntityTable
        type={title}
        fields={displayFields}
        data={items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EntityModal
        type={title}
        fields={fields}
        isOpen={isModalOpen}
        initialData={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function buildInputData(type: EntityType, data: EntityData) {
  const base = {
    ...(data.id && { id: data.id }), 
    name: data.name,
  };
  switch (type) {
    case 'Students':
      return {
        ...base,
        classId: data.classId,
      };
    case 'Teachers':
      return {
        ...base,
        subjectId: data.subjectId,
        classIds: data.classIds,
      };
    default:
      return base;
  }
}

function transformResponseData(type: EntityType, data: any): EntityData {
  if (!data) {
    console.error('No data provided to transformResponseData');
    return { id: '', name: '' };
  }

  switch (type) {
    case 'Students':
      return {
        id: data.id || '',
        name: data.user?.name ?? '',
        email: data.user?.email ?? '',
        classId: data.class?.id ?? '',
        className: data.class?.name ?? '',
      };
    case 'Teachers':
      return {
        id: data.id || '',
        name: data.user?.name ?? '',
        email: data.user?.email ?? '',
        subjectId: data.subject?.id ?? '',
        subjectName: data.subject?.name ?? '',
        classIds: data.classes?.map((c: any) => c.id) ?? [],
        classNames: data.classes?.map((c: any) => c.name) ?? [],
      };
    default:
      return {
        id: data.id || '',
        name: data.name || '',
      };
  }
}