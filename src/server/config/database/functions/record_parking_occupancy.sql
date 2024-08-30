--SHOW VARIABLES LIKE 'event_scheduler';
SET GLOBAL event_scheduler = ON;

CREATE EVENT record_parking_occupancy
ON SCHEDULE EVERY 1 MINUTE
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    INSERT INTO parking_occupancy_trends(location_id, date, total_slots, available_slots, unavailable_slots, occupied_slots, occupancy_rate)
    SELECT
        location_id,
        CURRENT_DATE(),
        NULLIF(total_slots, 0) as total_slots,
        NULLIF(available_slots, 0) as available_slots,
        NULLIF(unavailable_slots, 0) as unavailable_slots,
        NULLIF(occupied_slots, 0) as occupied_slots,
        round(((occupied_slots / NULLIF(total_slots, 0)) * 100),2) AS occupancy_rate
    FROM location_slot_summary;
END;
