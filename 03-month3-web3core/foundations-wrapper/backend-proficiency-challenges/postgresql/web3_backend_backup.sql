--
-- PostgreSQL database dump
--

\restrict dSXrwyjgvXPTr76djBtdbVycmmnrgixBmWkrVcU7cMYKLrLvZnDft2VMRPYUSUM

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: balances; Type: TABLE; Schema: public; Owner: bthezatulo
--

CREATE TABLE public.balances (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    token_id integer NOT NULL,
    balance_wei bigint DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT balances_balance_wei_check CHECK ((balance_wei >= 0))
);


ALTER TABLE public.balances OWNER TO bthezatulo;

--
-- Name: balances_id_seq; Type: SEQUENCE; Schema: public; Owner: bthezatulo
--

CREATE SEQUENCE public.balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.balances_id_seq OWNER TO bthezatulo;

--
-- Name: balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bthezatulo
--

ALTER SEQUENCE public.balances_id_seq OWNED BY public.balances.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: bthezatulo
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    symbol text NOT NULL,
    name text,
    decimals integer,
    contract_address text,
    CONSTRAINT tokens_decimals_check CHECK ((decimals >= 0))
);


ALTER TABLE public.tokens OWNER TO bthezatulo;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: bthezatulo
--

CREATE SEQUENCE public.tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_id_seq OWNER TO bthezatulo;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bthezatulo
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: wallets; Type: TABLE; Schema: public; Owner: bthezatulo
--

CREATE TABLE public.wallets (
    id integer NOT NULL,
    address text NOT NULL,
    label text,
    first_seen_block integer,
    created_at timestamp with time zone DEFAULT now(),
    total_balance_wei bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.wallets OWNER TO bthezatulo;

--
-- Name: wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: bthezatulo
--

CREATE SEQUENCE public.wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wallets_id_seq OWNER TO bthezatulo;

--
-- Name: wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bthezatulo
--

ALTER SEQUENCE public.wallets_id_seq OWNED BY public.wallets.id;


--
-- Name: balances id; Type: DEFAULT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.balances ALTER COLUMN id SET DEFAULT nextval('public.balances_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: wallets id; Type: DEFAULT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.wallets ALTER COLUMN id SET DEFAULT nextval('public.wallets_id_seq'::regclass);


--
-- Data for Name: balances; Type: TABLE DATA; Schema: public; Owner: bthezatulo
--

COPY public.balances (id, wallet_id, token_id, balance_wei, updated_at) FROM stdin;
3	1	3	0	2026-06-25 17:00:42.216221+07
4	2	1	1000000000000000000	2026-06-25 17:00:42.216221+07
5	2	2	2000000	2026-06-25 17:00:42.216221+07
6	2	3	5000000000000000000	2026-06-25 17:00:42.216221+07
7	3	1	0	2026-06-25 17:00:42.216221+07
8	3	2	500000	2026-06-25 17:00:42.216221+07
9	3	3	1000000000000000000	2026-06-25 17:00:42.216221+07
10	4	1	2000000000000000000	2026-06-25 17:00:42.216221+07
11	4	2	3000000	2026-06-25 17:00:42.216221+07
12	4	3	0	2026-06-25 17:00:42.216221+07
13	5	1	100000000000000000	2026-06-25 17:00:42.216221+07
14	5	2	1500000	2026-06-25 17:00:42.216221+07
15	5	3	7500000000000000000	2026-06-25 17:00:42.216221+07
2	1	2	2000000	2026-06-25 17:00:42.216221+07
1	1	1	2222222222222222222	2026-06-25 17:00:42.216221+07
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: bthezatulo
--

COPY public.tokens (id, symbol, name, decimals, contract_address) FROM stdin;
1	ETH	Ether	18	0xethaddr
2	USDC	USD Coin	6	0xusdcaddr
3	DAI	Dai Stablecoin	18	0xdaiaddr
\.


--
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: bthezatulo
--

COPY public.wallets (id, address, label, first_seen_block, created_at, total_balance_wei) FROM stdin;
2	0xwallet2	Bob	1001	2026-06-25 17:00:42.214629+07	6000000000002000000
3	0xwallet3	Charlie	1002	2026-06-25 17:00:42.214629+07	1000000000000500000
4	0xwallet4	Diana	1003	2026-06-25 17:00:42.214629+07	2000000000003000000
5	0xwallet5	Eve	1004	2026-06-25 17:00:42.214629+07	7600000000001500000
1	0xwallet1	Alice	1000	2026-06-25 17:00:42.214629+07	6000000000002000000
\.


--
-- Name: balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bthezatulo
--

SELECT pg_catalog.setval('public.balances_id_seq', 17, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bthezatulo
--

SELECT pg_catalog.setval('public.tokens_id_seq', 3, true);


--
-- Name: wallets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bthezatulo
--

SELECT pg_catalog.setval('public.wallets_id_seq', 5, true);


--
-- Name: balances balances_pkey; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.balances
    ADD CONSTRAINT balances_pkey PRIMARY KEY (id);


--
-- Name: balances balances_wallet_id_token_id_key; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.balances
    ADD CONSTRAINT balances_wallet_id_token_id_key UNIQUE (wallet_id, token_id);


--
-- Name: tokens tokens_contract_address_key; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_contract_address_key UNIQUE (contract_address);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_symbol_key; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_symbol_key UNIQUE (symbol);


--
-- Name: wallets wallets_address_key; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_address_key UNIQUE (address);


--
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- Name: idx_balances_token_id; Type: INDEX; Schema: public; Owner: bthezatulo
--

CREATE INDEX idx_balances_token_id ON public.balances USING btree (token_id);


--
-- Name: idx_balances_wallet_id; Type: INDEX; Schema: public; Owner: bthezatulo
--

CREATE INDEX idx_balances_wallet_id ON public.balances USING btree (wallet_id);


--
-- Name: balances balances_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.balances
    ADD CONSTRAINT balances_token_id_fkey FOREIGN KEY (token_id) REFERENCES public.tokens(id);


--
-- Name: balances balances_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bthezatulo
--

ALTER TABLE ONLY public.balances
    ADD CONSTRAINT balances_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dSXrwyjgvXPTr76djBtdbVycmmnrgixBmWkrVcU7cMYKLrLvZnDft2VMRPYUSUM

