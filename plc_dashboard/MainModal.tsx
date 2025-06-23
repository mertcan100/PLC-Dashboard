import React, { useEffect, useState } from "react";

interface MainModalProps {
  open: boolean;
  onClose: () => void;
  openAddModal: () => void;
  currentCard: string | null;
}

interface PredictionData {
  name: string;
  db_number: number;
  start_address: number;
  data_type: string;
  size: number;
  read_value: number | null;
}

const MainModal: React.FC<MainModalProps> = ({
  open,
  onClose,
  openAddModal,
  currentCard,
}) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    if (!currentCard) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/latest-prediction");
      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const data = await response.json();
      console.log("Alınan veri:", data);

      if (data.tags && Array.isArray(data.tags)) {
        const predictionsData = data.tags.map((tag: any) => ({
          name: tag.name || "N/A",
          db_number: tag.db_number || 0,
          start_address: tag.start_address || 0,
          data_type: tag.data_type || "N/A",
          size: tag.size || 0,
          read_value: tag.read_value || null,
        }));

        setPredictions(predictionsData);
        console.log("Processed Predictions:", predictionsData);
      } else {
        setPredictions([]);
      }
    } catch (error: any) {
      console.error("Veri çekme hatası:", error);
      setError("Veri çekilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPredictions();
    }
  }, [open, currentCard]);

  return (
    open && (
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content" style={{ borderRadius: "16px" }}>
            <div className="modal-header">
              <h5 className="modal-title">{currentCard}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f8f9fa" }}>
              <button
                className="btn btn-primary mb-4"
                onClick={openAddModal}
              >
                Yeni Veri Ekle
              </button>

              {loading && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {!loading && !error && predictions.length === 0 && (
                <p>Gösterilecek veri bulunamadı. Lütfen ilgili PLC'de veri olduğundan emin olun.</p>
              )}

              {!loading && !error && predictions.length > 0 && (
                <div className="table-responsive">
                  <table
                    className="table table-bordered align-middle"
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#495057",
                      }}
                    >
                      <tr>
                        <th className="text-start">Ad</th>
                        <th className="text-start">DB Number</th>
                        <th className="text-start">Start Address</th>
                        <th className="text-start">Data Type</th>
                        <th className="text-start">Size</th>
                        <th className="text-start">Read Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((data, index) => (
                        <tr
                          key={index}
                          style={{
                            background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#e9ecef";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              index % 2 === 0 ? "#f9f9f9" : "#fff";
                          }}
                        >
                          <td className="text-start">{data.name}</td>
                          <td className="text-start">{data.db_number}</td>
                          <td className="text-start">{data.start_address}</td>
                          <td className="text-start">{data.data_type}</td>
                          <td className="text-start">{data.size}</td>
                          <td className="text-start">
                            {data.read_value !== null
                              ? data.read_value.toString()
                              : "Yok"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MainModal;
