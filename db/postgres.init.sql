--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-07-25 19:30:30 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: administrator
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO administrator;

--
-- TOC entry 897 (class 1247 OID 16537)
-- Name: enum_assignment_loan_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_assignment_loan_status AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public.enum_assignment_loan_status OWNER TO administrator;

--
-- TOC entry 885 (class 1247 OID 16489)
-- Name: enum_assignment_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_assignment_status AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public.enum_assignment_status OWNER TO administrator;

--
-- TOC entry 909 (class 1247 OID 16578)
-- Name: enum_discount_note_status_dispatched; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_discount_note_status_dispatched AS ENUM (
    'EXITOSO',
    'FALLIDO',
    'PENDIENTE',
    'REINTENTANDO'
);


ALTER TYPE public.enum_discount_note_status_dispatched OWNER TO administrator;

--
-- TOC entry 906 (class 1247 OID 16568)
-- Name: enum_discount_note_status_signature; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_discount_note_status_signature AS ENUM (
    'PENDIENTE',
    'APROBADO',
    'RECHAZADO',
    'CANCELADO'
);


ALTER TYPE public.enum_discount_note_status_signature OWNER TO administrator;

--
-- TOC entry 873 (class 1247 OID 16454)
-- Name: enum_employee_access_token_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_employee_access_token_status AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public.enum_employee_access_token_status OWNER TO administrator;

--
-- TOC entry 852 (class 1247 OID 16391)
-- Name: enum_location_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_location_status AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public.enum_location_status OWNER TO administrator;

--
-- TOC entry 879 (class 1247 OID 16470)
-- Name: enum_schedule_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_schedule_status AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public.enum_schedule_status OWNER TO administrator;

--
-- TOC entry 864 (class 1247 OID 16420)
-- Name: enum_slot_cost_type; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_slot_cost_type AS ENUM (
    'SIN_COSTO',
    'DESCUENTO',
    'COMPLEMENTO'
);


ALTER TYPE public.enum_slot_cost_type OWNER TO administrator;

--
-- TOC entry 858 (class 1247 OID 16406)
-- Name: enum_slot_slot_type; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_slot_slot_type AS ENUM (
    'SIMPLE',
    'MULTIPLE'
);


ALTER TYPE public.enum_slot_slot_type OWNER TO administrator;

--
-- TOC entry 867 (class 1247 OID 16428)
-- Name: enum_slot_status; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_slot_status AS ENUM (
    'DISPONIBLE',
    'OCUPADO',
    'INACTIVO'
);


ALTER TYPE public.enum_slot_status OWNER TO administrator;

--
-- TOC entry 861 (class 1247 OID 16412)
-- Name: enum_slot_vehicle_type; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_slot_vehicle_type AS ENUM (
    'CARRO',
    'MOTO',
    'CAMION'
);


ALTER TYPE public.enum_slot_vehicle_type OWNER TO administrator;

--
-- TOC entry 891 (class 1247 OID 16517)
-- Name: enum_vehicle_type; Type: TYPE; Schema: public; Owner: administrator
--

CREATE TYPE public.enum_vehicle_type AS ENUM (
    'CARRO',
    'MOTO',
    'CAMION'
);


ALTER TYPE public.enum_vehicle_type OWNER TO administrator;

--
-- TOC entry 225 (class 1255 OID 16608)
-- Name: can_create_more_schedules_in_slot(character varying); Type: FUNCTION; Schema: public; Owner: administrator
--

CREATE FUNCTION public.can_create_more_schedules_in_slot(slt_id character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
        declare schedules_allowed int;
        declare schedules_created int;
        begin
                select limit_schedules into schedules_allowed from slot where id = slt_id;
                select count(*) into schedules_created from schedule where slot_id = slt_id and status = 'ACTIVO';

                if (schedules_created < schedules_allowed) then
                        return true;
                end if;

                return false;
        end;
$$;


ALTER FUNCTION public.can_create_more_schedules_in_slot(slt_id character varying) OWNER TO administrator;

--
-- TOC entry 226 (class 1255 OID 16609)
-- Name: de_assignment_employee(); Type: FUNCTION; Schema: public; Owner: administrator
--

CREATE FUNCTION public.de_assignment_employee() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
        begin
            update schedule set status = 'INACTIVO' where id = new.schedule_id;
            update assignment_loan set status = 'INACTIVO' where assignment_id = new.id;
            update slot set status = 'DISPONIBLE' where id = new.slot_id;
            return new;
        end;
    $$;


ALTER FUNCTION public.de_assignment_employee() OWNER TO administrator;

--
-- TOC entry 227 (class 1255 OID 16611)
-- Name: employee_has_an_active_assignment(character varying); Type: FUNCTION; Schema: public; Owner: administrator
--

CREATE FUNCTION public.employee_has_an_active_assignment(emplo_id character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
        declare hasAssignment bool;
        begin

        select EXISTS (select 1
                       from assignment a
                       where a.employee_id = emplo_id
                         and a.status = 'ACTIVO'
                       union all
                       select 1
                       from assignment_loan al
                       where al.employee_id = emplo_id
                         and al.status = 'ACTIVO')
        INTO hasAssignment;

    return hasAssignment;

        end;
 $$;


ALTER FUNCTION public.employee_has_an_active_assignment(emplo_id character varying) OWNER TO administrator;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16493)
-- Name: assignment; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.assignment (
    id character varying(255) NOT NULL,
    slot_id character varying(255),
    employee_id character varying(255),
    assignment_date timestamp with time zone,
    schedule_id character varying(255),
    status public.enum_assignment_status DEFAULT 'ACTIVO'::public.enum_assignment_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.assignment OWNER TO administrator;

--
-- TOC entry 221 (class 1259 OID 16541)
-- Name: assignment_loan; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.assignment_loan (
    id character varying(255) NOT NULL,
    assignment_id character varying(255) NOT NULL,
    employee_id character varying(255) NOT NULL,
    start_date_assignment timestamp with time zone NOT NULL,
    end_date_assignment timestamp with time zone NOT NULL,
    assignment_date timestamp with time zone NOT NULL,
    status public.enum_assignment_loan_status DEFAULT 'ACTIVO'::public.enum_assignment_loan_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.assignment_loan OWNER TO administrator;

--
-- TOC entry 222 (class 1259 OID 16559)
-- Name: de_assignment; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.de_assignment (
    id character varying(255) NOT NULL,
    assignment_id character varying(255) NOT NULL,
    reason character varying(255) NOT NULL,
    de_assignment_date timestamp with time zone NOT NULL,
    is_rpa_action boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.de_assignment OWNER TO administrator;

--
-- TOC entry 223 (class 1259 OID 16587)
-- Name: discount_note; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.discount_note (
    id character varying(255) NOT NULL,
    assignment_id character varying(255) NOT NULL,
    status_signature public.enum_discount_note_status_signature DEFAULT 'PENDIENTE'::public.enum_discount_note_status_signature,
    status_dispatched public.enum_discount_note_status_dispatched DEFAULT 'PENDIENTE'::public.enum_discount_note_status_dispatched,
    last_notice timestamp with time zone,
    next_notice timestamp with time zone,
    reminder_frequency integer DEFAULT 2,
    dispatch_attempts integer DEFAULT 0,
    max_dispatch_attempts integer DEFAULT 3,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.discount_note OWNER TO administrator;

--
-- TOC entry 217 (class 1259 OID 16459)
-- Name: employee; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.employee (
    id character varying(255) NOT NULL,
    code_employee character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    workplace character varying(255),
    identifier_document character varying(255),
    company character varying(255),
    department character varying(255),
    sub_management character varying(255),
    management_1 character varying(255),
    management_2 character varying(255),
    work_site character varying(255),
    address character varying(255),
    email character varying(255),
    phone character varying(255),
    access_token character varying(255),
    access_token_status public.enum_employee_access_token_status DEFAULT 'INACTIVO'::public.enum_employee_access_token_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.employee OWNER TO administrator;

--
-- TOC entry 215 (class 1259 OID 16395)
-- Name: location; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.location (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    contact_reference character varying(255),
    phone character varying(255),
    email character varying(255),
    comments character varying(255),
    latitude double precision DEFAULT '0'::double precision,
    longitude double precision DEFAULT '0'::double precision,
    status public.enum_location_status DEFAULT 'ACTIVO'::public.enum_location_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.location OWNER TO administrator;

--
-- TOC entry 218 (class 1259 OID 16475)
-- Name: schedule; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.schedule (
    id character varying(255) NOT NULL,
    slot_id character varying(255) NOT NULL,
    start_time_assignment time without time zone NOT NULL,
    end_time_assignment time without time zone NOT NULL,
    status public.enum_schedule_status DEFAULT 'ACTIVO'::public.enum_schedule_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.schedule OWNER TO administrator;

--
-- TOC entry 224 (class 1259 OID 16599)
-- Name: setting; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.setting (
    id character varying(255) NOT NULL,
    setting_key character varying(255) NOT NULL,
    setting_value character varying(255) NOT NULL,
    description character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.setting OWNER TO administrator;

insert into setting (id, setting_key, setting_value, description, created_at, updated_at)
VALUES ('895b40e8-2fbf-4312-bd2e-15aa3ae96c82', 'WS_EMPLOYEES', 'https://jsonplaceholder.typicode.com/users', 'Web service', current_timestamp, current_timestamp);

--
-- TOC entry 216 (class 1259 OID 16435)
-- Name: slot; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.slot (
    id character varying(255) NOT NULL,
    location_id character varying(255) NOT NULL,
    slot_number character varying(255) NOT NULL,
    slot_type public.enum_slot_slot_type DEFAULT 'SIMPLE'::public.enum_slot_slot_type,
    limit_schedules integer DEFAULT 0 NOT NULL,
    vehicle_type public.enum_slot_vehicle_type DEFAULT 'CARRO'::public.enum_slot_vehicle_type,
    cost_type public.enum_slot_cost_type DEFAULT 'SIN_COSTO'::public.enum_slot_cost_type,
    cost double precision DEFAULT '0'::double precision,
    status public.enum_slot_status DEFAULT 'DISPONIBLE'::public.enum_slot_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.slot OWNER TO administrator;

--
-- TOC entry 220 (class 1259 OID 16523)
-- Name: vehicle; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.vehicle (
    id character varying(255) NOT NULL,
    employee_id character varying(255) NOT NULL,
    vehicle_badge character varying(255) NOT NULL,
    color character varying(255),
    brand character varying(255),
    model character varying(255),
    type public.enum_vehicle_type DEFAULT 'CARRO'::public.enum_vehicle_type,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.vehicle OWNER TO administrator;

--
-- TOC entry 3477 (class 0 OID 16493)
-- Dependencies: 219
-- Data for Name: assignment; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.assignment (id, slot_id, employee_id, assignment_date, schedule_id, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3479 (class 0 OID 16541)
-- Dependencies: 221
-- Data for Name: assignment_loan; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.assignment_loan (id, assignment_id, employee_id, start_date_assignment, end_date_assignment, assignment_date, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3480 (class 0 OID 16559)
-- Dependencies: 222
-- Data for Name: de_assignment; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.de_assignment (id, assignment_id, reason, de_assignment_date, is_rpa_action, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3481 (class 0 OID 16587)
-- Dependencies: 223
-- Data for Name: discount_note; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.discount_note (id, assignment_id, status_signature, status_dispatched, last_notice, next_notice, reminder_frequency, dispatch_attempts, max_dispatch_attempts, created_at, updated_at) FROM stdin;
deec9d9b-0a14-410c-8f67-c389182a6213    0ef77d47-3559-429e-be1c-4ea4fa6f29e6    CANCELADO       PENDIENTE       \N      \N      2       0      2024-07-23 22:13:52.608+00       2024-07-23 22:54:31.036+00
\.


--
-- TOC entry 3475 (class 0 OID 16459)
-- Dependencies: 217
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.employee (id, code_employee, name, workplace, identifier_document, company, department, sub_management, management_1, management_2, work_site, address, email, phone, access_token, access_token_status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3473 (class 0 OID 16395)
-- Dependencies: 215
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.location (id, name, address, contact_reference, phone, email, comments, latitude, longitude, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3476 (class 0 OID 16475)
-- Dependencies: 218
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.schedule (id, slot_id, start_time_assignment, end_time_assignment, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3482 (class 0 OID 16599)
-- Dependencies: 224
-- Data for Name: setting; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.setting (id, setting_key, setting_value, description, created_at, updated_at) FROM stdin;
895b40e8-2fbf-4312-bd2e-15aa3ae96c82    WS_EMPLOYEES    https://jsonplaceholder.typicode.com/users      Web service     2024-07-23 18:08:24.832496+00   2024-07-23 18:08:24.832496+00
\.


--
-- TOC entry 3474 (class 0 OID 16435)
-- Dependencies: 216
-- Data for Name: slot; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.slot (id, location_id, slot_number, slot_type, limit_schedules, vehicle_type, cost_type, cost, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3478 (class 0 OID 16523)
-- Dependencies: 220
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.vehicle (id, employee_id, vehicle_badge, color, brand, model, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3312 (class 2606 OID 16548)
-- Name: assignment_loan assignment_loan_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment_loan
    ADD CONSTRAINT assignment_loan_pkey PRIMARY KEY (id);


--
-- TOC entry 3308 (class 2606 OID 16500)
-- Name: assignment assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 16566)
-- Name: de_assignment de_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.de_assignment
    ADD CONSTRAINT de_assignment_pkey PRIMARY KEY (id);


--
-- TOC entry 3316 (class 2606 OID 16598)
-- Name: discount_note discount_note_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.discount_note
    ADD CONSTRAINT discount_note_pkey PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 16468)
-- Name: employee employee_code_employee_key; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_code_employee_key UNIQUE (code_employee);


--
-- TOC entry 3304 (class 2606 OID 16466)
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 16404)
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- TOC entry 3306 (class 2606 OID 16482)
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (id);


--
-- TOC entry 3318 (class 2606 OID 16605)
-- Name: setting setting_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 16607)
-- Name: setting setting_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_setting_key_key UNIQUE (setting_key);


--
-- TOC entry 3300 (class 2606 OID 16447)
-- Name: slot slot_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.slot
    ADD CONSTRAINT slot_pkey PRIMARY KEY (id);


--
-- TOC entry 3310 (class 2606 OID 16530)
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2620 OID 16610)
-- Name: assignment de_assignment_action; Type: TRIGGER; Schema: public; Owner: administrator
--

CREATE TRIGGER de_assignment_action AFTER UPDATE ON public.assignment FOR EACH ROW WHEN (((old.status IS DISTINCT FROM new.status) AND (new.status = 'INACTIVO'::public.enum_assignment_status))) EXECUTE FUNCTION public.de_assignment_employee();


--
-- TOC entry 3323 (class 2606 OID 16506)
-- Name: assignment assignment_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3327 (class 2606 OID 16549)
-- Name: assignment_loan assignment_loan_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment_loan
    ADD CONSTRAINT assignment_loan_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3328 (class 2606 OID 16554)
-- Name: assignment_loan assignment_loan_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment_loan
    ADD CONSTRAINT assignment_loan_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3324 (class 2606 OID 16511)
-- Name: assignment assignment_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedule(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3325 (class 2606 OID 16501)
-- Name: assignment assignment_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.slot(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3322 (class 2606 OID 16483)
-- Name: schedule schedule_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.slot(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3321 (class 2606 OID 16448)
-- Name: slot slot_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.slot
    ADD CONSTRAINT slot_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3326 (class 2606 OID 16531)
-- Name: vehicle vehicle_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- Completed on 2024-07-25 19:30:33 UTC

--
-- PostgreSQL database dump complete
--
