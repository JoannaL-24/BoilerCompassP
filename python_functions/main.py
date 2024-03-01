# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, logger
from firebase_admin import initialize_app, firestore, storage
from io import BytesIO
from PIL import Image
import pytesseract
from better_profanity import profanity

app = initialize_app(credential=None, options={"projectId": "boilercompass-3135d"})
db = firestore.client()
bucket = storage.bucket()

@https_fn.on_request()
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

    return https_fn.Response("YES")

