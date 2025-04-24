clean:
	@echo "=== removing old build dir ===="
	rm -rf build

image:
	make clean
	docker build -t gcr.io/zapdine/typeface-assignment-filenest-frontent .
	docker push gcr.io/zapdine/typeface-assignment-filenest-frontent
	gcloud run deploy zapdine-frontend-staging --region=asia-south1 --project=zapdine --image gcr.io/zapdine/typeface-assignment-filenest-frontent --allow-unauthenticated --port 3000