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

  // const filteredEvents =
  //   data?.events.filter((event) => {
  //     if (type && event.type !== type) {
  //       console.log(`Filtered out event with type: ${event.type}`);
  //       return false;
  //     }
  //     const index = data.events.indexOf(event);
  //     return (
  //       (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index
  //     );
  //   }) || [];

  // Si la variable Type est définie, j'affiche le "type" correspondant, sinon j'affiche tous les événements
  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events.filter((event) => event.type === type)) || []
  ).filter((_events, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const totalEvents =
    data?.events.filter((event) => (type ? event.type === type : true))
      .length || 0;
  const pageNumber = Math.ceil(totalEvents / PER_PAGE);
  const typeList = Array.from(new Set(data?.events.map((event) => event.type)));
  console.log("Data loaded:", data);
  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value)}
            titleEmpty={false}
            label="Type d'événement"
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
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
            {Array.from({ length: pageNumber }, (_, n) => (
              <a
                key={`page-${n + 1}`}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;