CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(100) NOT NULL UNIQUE,
	"password" VARCHAR(100) NOT NULL,
	"avatar" VARCHAR,
	"superadmin" BOOLEAN
    -- phone number also added
);

CREATE TABLE "events" (
	"event_id" SERIAL PRIMARY KEY,
	"event_date" DATE NOT NULL,
	"event_time" time without time zone NOT NULL,
	"event_name" VARCHAR(100) NOT NULL,
	"description" VARCHAR(1000) NOT NULL,
	"location" VARCHAR(250) NOT NULL,
	"event_type_id" INT REFERENCES "event_types" NOT NULL,
	"event_admin" INT REFERENCES "users" NOT NULL,
	"group_id" INT REFERENCES "groups" NOT NULL
);

CREATE TABLE "event_types" (
	"event_type_id" SERIAL PRIMARY KEY,
	"event_type" VARCHAR(50) NOT NULL
);

CREATE TABLE "rsvp" (
	"events_users_id" SERIAL PRIMARY KEY,
	"event_id" INT REFERENCES "events" NOT NULL,
	"membership_id" INT REFERENCES "memberships" NOT NULL,
	"status" INT REFERENCES "rsvp_types" NOT NULL
);

CREATE TABLE "rsvp_types" (
	"rsvp_types_id" SERIAL PRIMARY KEY,
	"rsvp_type" VARCHAR(50) NOT NULL
);

CREATE TABLE "groups" (
	"id" SERIAL PRIMARY KEY,
	"owner" INT REFERENCES "users" NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"description" VARCHAR(1000) NOT NULL,
	"logo" VARCHAR,
	"privacy_type" VARCHAR
);

CREATE TABLE "memberships" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "users" NOT NULL,
	"group_id" INT REFERENCES "groups" NOT NULL,
	"status" VARCHAR
);

CREATE TABLE "comments" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INT REFERENCES "events" NOT NULL,
	"user_id" INT REFERENCES "users" NOT NULL,
	"comment" VARCHAR(500)
);
