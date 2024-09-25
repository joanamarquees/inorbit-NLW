export async function createCompletedGoal(goalId: string) {
  await fetch('http://localhost:3333/completed-goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ goalId }),
  })
}