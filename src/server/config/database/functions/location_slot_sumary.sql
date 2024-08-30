CREATE VIEW location_slot_summary AS
SELECT
  location_id,
  COUNT(*) AS total_slots,
  SUM(CASE WHEN status = 'DISPONIBLE' THEN 1 ELSE 0 END) AS available_slots,
  SUM(CASE WHEN status = 'INACTIVO' THEN 1 ELSE 0 END) AS unavailable_slots,
  SUM(CASE WHEN status = 'OCUPADO' THEN 1 ELSE 0 END) AS occupied_slots
FROM  slot
group by location_id
