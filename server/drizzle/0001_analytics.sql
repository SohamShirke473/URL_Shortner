CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url_id" uuid NOT NULL,
	"ip_address" varchar(255) NOT NULL,
	"user_agent" varchar(255) NOT NULL,
	"clicked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_url_id_url_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."url"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "url_analytics_url_idx" ON "analytics" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "url_analytics_time_idx" ON "analytics" USING btree ("clicked_at");