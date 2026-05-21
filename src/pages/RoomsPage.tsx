import { useRooms } from '../hooks/useRooms'
import { RoomCard } from '../components/RoomCard'
import './RoomsPage.css'

export function RoomsPage() {
  const { rooms } = useRooms()

  return (
    <main className="rooms-page">
      <h1 className="rooms-page__title">Discussion Rooms</h1>
      <ul className="rooms-page__list" role="list">
        {rooms.map((room) => (
          <li key={room.id}>
            <RoomCard room={room} />
          </li>
        ))}
      </ul>
    </main>
  )
}
