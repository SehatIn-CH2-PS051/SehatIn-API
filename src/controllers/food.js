const { Storage } = require('@google-cloud/storage');
const path = require('path');
const axios = require('axios');

// initialize GCP bucket
const storage = new Storage();

const bucket = storage.bucket(process.env.BUCKET_NAME);

const food = async (req, res) => {
  try {
    const { file } = req;

    // Upload the file to Cloud Storage
    const cloudFile = bucket.file(file.originalname);
    const stream = cloudFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.end(file.buffer);

    stream.on('finish', async () => {
      const image = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${file.originalname}`;
      // detect food
      const result = await axios.post(
        process.env.FOOD_DETECTION_API,
        { url: image },
      );
      
      // request to 2nd endpoint
      const foodDetail = await axios.post(
        process.env.FATSECRET_API,
        { makanan: result.data.detected_objects[0]['food_name'] },
      );

      return res.status(200).json({
        code: 200,
        status: 'OK',
        data: foodDetail.data.data
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'There is an error on our side :('
    });
  }
};

module.exports = { food };