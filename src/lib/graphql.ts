export async function graphql<TResponse, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TResponse> {
  const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${typeof window !== 'undefined' ? token : ''}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}
