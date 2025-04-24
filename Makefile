clean:
	@echo "=== removing old build dir ===="
	rm -rf build

image:
	make clean
	docker build -t gcr.io/zapdine/typeface-assignment-filenest-frontend .
	docker push gcr.io/zapdine/typeface-assignment-filenest-frontend
	gcloud run deploy typeface-assignment-filenest-frontend --region=asia-south1 --project=zapdine --image gcr.io/zapdine/typeface-assignment-filenest-frontend --allow-unauthenticated --port 3000