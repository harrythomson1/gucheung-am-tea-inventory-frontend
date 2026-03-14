import { getDashboard } from '../api/dashboard'

export default function Dashboard() {
  return (
    <>
      <div>Dashboard</div>
      <button onClick={getDashboard}>I am a button</button>
    </>
  )
}
