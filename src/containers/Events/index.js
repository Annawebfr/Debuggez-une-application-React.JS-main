import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (error) return <div>Une erreur est survenue.</div>;
  if (!data || !data.events) return <div>Chargement en cours...</div>;

  // ✅ Je trie les events uniquement une fois que data.events existe
  const sortedEvents = [...data.events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ✅ Je filtre ensuite par type (si un type est sélectionné)
  const filteredEvents = sortedEvents.filter((event) =>
    type ? event.type === type : true
  );

  // ✅ Pagination : je garde seulement les events de la page en cours
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const totalEvents = filteredEvents.length;
  const pageNumber = Math.ceil(totalEvents / PER_PAGE);

  const typeList = Array.from(new Set(data.events.map((event) => event.type)));

  const changeType = (evtType) => {
    setType(evtType);
    setCurrentPage(1); // Reset page quand on change de type
  };

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList}
        onChange={(value) => changeType(value)}
        titleEmpty={false}
        label="Type d'événement"
      />

      <div id="events" className="ListContainer">
        {paginatedEvents.map((event) => (
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>

      <div className="Pagination">
        {Array.from({ length: pageNumber }, (_, i) => (
          <a
            key={`page-${i + 1}`}
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i + 1);
            }}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
              textDecoration: currentPage === i + 1 ? "underline" : "none",
            }}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;