async function testDispatch() {
  try {
    const postRes = await fetch('http://localhost:3000/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teammate_id: 'assignee-rahul',
        recipient_name: 'Rahul Sharma',
        channel: 'whatsapp',
        language: 'hi',
        headline: 'मीटिंग का समय',
      }),
    });
    const postData = await postRes.json();
    console.log('POST /api/dispatch response:', postData);

    const getRes = await fetch('http://localhost:3000/api/dispatch');
    const getData = await getRes.json();
    console.log('GET /api/dispatch response:', getData);
  } catch (err) {
    console.error('Test dispatch error:', err);
  }
}

testDispatch();
