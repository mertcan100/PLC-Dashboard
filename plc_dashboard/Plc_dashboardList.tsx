import React, { useState, useEffect } from "react";
import MenuSection from "./MenuSection";
import CardsList from "./CardsList";
import MainModal from "./MainModal";
import AddDataModal from "./AddDataModal";

const Plc_dashboardList = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [plcData, setPlcData] = useState<{ [key: string]: any[] }>({});
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [newData, setNewData] = useState<any>({
    name: "",
    start: "",
    wordLength: "",
    bit: "",
    min: 0, // Kullanıcıdan alınacak minimum değer
    max: 100, // Kullanıcıdan alınacak maksimum değer
  });

  const toggleOption = (option: string) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option]
    );
  };

  const handleModalOpen = (cardName: string) => {
    setOpenModal(cardName);
    setCurrentCard(cardName);
  };

  const handleModalClose = () => {
    setOpenModal(null);
    setCurrentCard(null);
  };

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
    setNewData({
      name: "",
      start: "",
      wordLength: "",
      bit: "",
      min: 0,
      max: 100,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (!newData.name || !newData.start) {
      alert("Name ve Start alanları zorunludur!");
      return;
    }

    setPlcData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[currentCard!]) {
        updatedData[currentCard!] = [];
      }
      updatedData[currentCard!].push({
        ...newData,
        start: parseFloat(newData.start), // Başlangıç değeri
        lastUpdated: new Date().toISOString(), // İlk kaydedildiği zaman
      });
      return updatedData;
    });

    handleAddModalClose();
  };

  // Dinamik veri güncelleme fonksiyonu
  const updateDynamicValues = () => {
    setPlcData((prevData) => {
      const updatedData = { ...prevData };
      Object.keys(updatedData).forEach((key) => {
        updatedData[key] = updatedData[key].map((item) => ({
          ...item,
          // "start" değerini min ve max arasında değiştir
          start:
            Math.random() * (parseFloat(item.max) - parseFloat(item.min)) +
            parseFloat(item.min),
          lastUpdated: new Date().toISOString(), // Güncellenme zamanı
        }));
      });
      return updatedData;
    });
  };

  // Dinamik güncellemeyi başlat
  useEffect(() => {
    const interval = setInterval(() => {
      updateDynamicValues();
    }, 3000); // 3 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <MenuSection selectedOptions={selectedOptions} toggleOption={toggleOption} />
      <CardsList selectedOptions={selectedOptions} handleModalOpen={handleModalOpen} />
      <MainModal
        open={!!openModal}
        onClose={handleModalClose}
        openAddModal={handleAddModalOpen}
        currentCard={currentCard}
        plcData={plcData}
      />
      <AddDataModal
        open={openAddModal}
        onClose={handleAddModalClose}
        newData={newData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </div>
  );
};

export default Plc_dashboardList;




// {
//   "name": "Bobin Durumu",
//   "start": "200",
//   "wordLength": "2",
//   "bit": "5",
//   "amount": "1",
//   "multiplier": "1",
//   "add": "0",
//   "minimum": "0",
//   "maximum": "10",
//   "sign": false,
//   "readOnly": true,
//   "enable": true,
//   "plc": "Alüminyum Kart 3"
// }

// {
//   "name": "Motor Hızı",
//   "start": "100",
//   "wordLength": "4",
//   "bit": "0",
//   "amount": "2",
//   "multiplier": "1.5",
//   "add": "0",
//   "minimum": "0",
//   "maximum": "5000",
//   "sign": true,
//   "readOnly": false,
//   "enable": true,
//   "plc": "Panel Kart 1"
// }