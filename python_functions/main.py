# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, logger, options
from firebase_admin import initialize_app, firestore, storage
from firebase_admin import credentials
from io import BytesIO
from PIL import Image
import pytesseract
from better_profanity import profanity

service_account_path = "/Users/williamhou/Downloads/boilercompass-3135d-firebase-adminsdk-tck0g-59ea95ecc4.json"
cred = credentials.Certificate(service_account_path)
app = initialize_app(
    credential=cred,
    options={
        "projectId": "boilercompass-3135d",
        "storageBucket": "boilercompass-3135d.appspot.com",
    },
)
db = firestore.client()
bucket = storage.bucket(app=app)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=["*"], cors_methods=["get", "post"])
)
def filter_image(req: https_fn.Request) -> https_fn.Response:
    data = req.get_data(as_text=True)

    image_name = data + ".png"
    # get image from storage
    buffer = BytesIO()
    blob = bucket.blob(image_name)
    blob.download_to_file(buffer)
    buffer.seek(0)
    image = Image.open(buffer)
    text = pytesseract.image_to_string(image)

    logger.info(f"{text=}")

    if profanity.contains_profanity(text):
        # delete file from firestore
        blob.delete()
        logger.info("Deleted image from storage: " + image_name)
        return https_fn.Response("NO")

    response = https_fn.Response("YES")
    return response
