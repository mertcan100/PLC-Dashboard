import React, { useState, useEffect } from "react";

interface CardsListProps {
  selectedOptions: string[];
  handleModalOpen: (cardName: string) => void;
}

interface PLCData {
  name: string;
  ip: string;
  rack: number;
  slot: number;
  isActive: boolean;
  lastUpdated: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);
};

const CardsList: React.FC<CardsListProps> = ({ selectedOptions, handleModalOpen }) => {
  const [plcData, setPlcData] = useState<PLCData[]>([]);

  const fetchLatestPrediction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/latest-prediction");
      if (!response.ok) {
        throw new Error("Sunucudan veri alınamadı.");
      }
      const data = await response.json();
      console.log("Alınan veri:", data);

      setPlcData((prevData) =>
        prevData.map((plc, index) => {
          if (index === 0) {
            return {
              ...plc,
              name: data.plc_info.plc_name || plc.name,
              ip: data.plc_info.plc_ip || plc.ip,
              rack: data.plc_info.plc_rack !== undefined ? data.plc_info.plc_rack : plc.rack,
              slot: data.plc_info.plc_slot !== undefined ? data.plc_info.plc_slot : plc.slot,
              lastUpdated: data.plc_info.detectdate || new Date().toISOString(),
              isActive: true,
            };
          }
          return plc;
        })
      );
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    const generateInitialPLCData = (): PLCData[] => {
      const predefinedIPs = [
        "192.168.0.1",
        "192.168.0.2",
        "192.168.0.3",
        "192.168.0.4",
      ];
      const randomBool = () => Math.random() > 0.5;

      return predefinedIPs.map((ip, index) => ({
        name: `PLC-${index + 1}`,
        ip,
        rack: 0,
        slot: 1,
        isActive: randomBool(),
        lastUpdated: new Date().toISOString(),
      }));
    };

    setPlcData(generateInitialPLCData());
    fetchLatestPrediction();

    const updateInterval = setInterval(() => {
      fetchLatestPrediction();
    }, 10000);

    return () => clearInterval(updateInterval);
  }, []);

  const renderCards = () => {
    const cards = [];
    if (selectedOptions.includes("panel")) {
      plcData.forEach((plc, index) => {
        cards.push(
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-5"
            key={`panel-${index}`}
            onClick={() => handleModalOpen(plc.name)}
          >
            <div
              className="card shadow-lg"
              style={{
                borderRadius: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                position: "relative",
                padding: "0",
                backgroundColor: "white",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0px 12px 24px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* Başlık Arka Planı */}
              <div
                style={{
                  backgroundColor: "#e3f2fd", // Soft açık mavi
                  padding: "16px",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                <h4
                  className="card-title text-dark font-weight-bold mb-0 text-center"
                  style={{ fontSize: "1.25rem" }}
                >
                  {plc.name}
                </h4>
              </div>

              {/* PLC Details */}
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Sol Taraf: IP */}
                  <div className="d-flex align-items-center">
                    <i
                      className="bi bi-hdd-network me-3"
                      style={{
                        fontSize: "1.5rem",
                        color: "#1e88e5", // Mavi ton
                      }}
                    ></i>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#343a40",
                      }}
                    >
                      {plc.ip}
                    </p>
                  </div>
                  {/* Sağ Taraf: Rack ve Slot */}
                  <div className="text-end">
                    <div className="d-flex align-items-center mb-1">
                      <i
                        className="bi bi-cpu me-2"
                        style={{
                          fontSize: "1.2rem",
                          color: "#43a047", // Yeşil ton
                        }}
                      ></i>
                      <p className="mb-0">
                        <strong>Rack:</strong> {plc.rack}
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <i
                        className="bi bi-server me-2"
                        style={{
                          fontSize: "1.2rem",
                          color: "#f4511e", // Turuncu ton
                        }}
                      ></i>
                      <p className="mb-0">
                        <strong>Slot:</strong> {plc.slot}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Son Güncelleme Tarihi */}
                <div className="text-muted mt-4" style={{ fontStyle: "italic", textAlign: "left" }}>
                  <small>
                    <i
                      className="bi bi-clock-history me-2"
                      style={{
                        color: "#6d4c41", // Kahverengi ton
                      }}
                    ></i>
                    <strong>Son Güncelleme:</strong> {formatDate(plc.lastUpdated)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return cards;
  };

  return <div className="row mt-4">{renderCards()}</div>;
};

export default CardsList;
