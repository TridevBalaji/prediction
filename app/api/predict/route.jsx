// app/api/predict/route.js

export const config = {
  api: {
    bodyParser: false,
  },
};

const PYTHON_API_URL = 'http://localhost:5001';

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/health`);
    const result = await response.json();

    return new Response(JSON.stringify({
      nextjs_status: 'healthy',
      python_server: result,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      nextjs_status: 'healthy',
      python_server: {
        status: 'unreachable',
        error: error.message,
      },
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let pythonResponse;

    // Base64 JSON request
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { imageData } = body;

      if (!imageData) {
        return new Response(JSON.stringify({ error: 'No image data provided', success: false }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      pythonResponse = await fetch(`${PYTHON_API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

    } else if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await request.formData();
      const image = formData.get('image');

      if (!image) {
        return new Response(JSON.stringify({ error: 'No image file provided', success: false }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const buffer = await image.arrayBuffer();
      const blob = new Blob([buffer], { type: image.type });
      const newForm = new FormData();
      newForm.append('image', blob, image.name);

      pythonResponse = await fetch(`${PYTHON_API_URL}/api/predict`, {
        method: 'POST',
        body: newForm,
      });
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type', success: false }), {
        status: 415,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const result = await pythonResponse.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Prediction failed',
      message: error.message,
      success: false,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
