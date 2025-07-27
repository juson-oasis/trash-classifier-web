document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const classifyBtn = document.getElementById('classifyBtn');
    const classificationResult = document.getElementById('classificationResult');

    // =======================================================================================
    // 1. 이미지 파일 업로드 처리
    // =======================================================================================
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagePreview.src = e.target.result; // 이미지 미리보기 업데이트
                imagePreview.style.display = 'block'; // 이미지 미리보기 표시
                classifyBtn.style.display = 'block'; // '분류하기' 버튼 표시
                classificationResult.textContent = "이미지를 업로드했습니다. '분류하기' 버튼을 눌러주세요."; // 결과 메시지 초기화
            };
            
            reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            classifyBtn.style.display = 'none';
            classificationResult.textContent = "이미지를 선택해주세요.";
        }
    });

    // =======================================================================================
    // ⭐️ 2. '분류하기' 버튼 클릭 시 (백엔드와 통신)
    // =======================================================================================
    classifyBtn.addEventListener('click', async () => {
        const imageDataUrl = imagePreview.src; // 현재 미리보기 이미지의 데이터 URL

        if (imageDataUrl && imageDataUrl !== '#') {
            classificationResult.textContent = "이미지를 분류 중입니다... 잠시만 기다려주세요.";
            
            try {
                // ⭐️ Flask 백엔드의 예측 API 엔드포인트
                // 로컬에서 Flask가 실행되는 주소와 포트를 지정합니다.
                const backendUrl = 'http://127.0.0.1:5000/predict'; 

                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // JSON 형식으로 데이터를 보낼 것임을 명시
                    },
                    // 이미지 데이터 URL을 JSON 객체 형태로 백엔드에 전송
                    body: JSON.stringify({ image: imageDataUrl }) 
                });

                if (!response.ok) {
                    // HTTP 상태 코드가 200 OK가 아닐 경우 에러 처리
                    const errorData = await response.json(); // 백엔드에서 에러 메시지를 JSON으로 보낼 수 있음
                    throw new Error(`백엔드 오류: ${response.status} - ${errorData.error || '알 수 없는 오류'}`);
                }

                const data = await response.json(); // 백엔드로부터 받은 JSON 응답 파싱

                // 분류 결과 화면에 표시
                if (data.class_name) {
                    // 확률을 백분율로 포맷팅
                    const confidencePercent = (data.confidence * 100).toFixed(2);
                    classificationResult.textContent = `분류 결과: ${data.class_name} (확률: ${confidencePercent}%)`;
                    classificationResult.style.color = '#28a745'; // 성공 시 색상
                } else {
                    classificationResult.textContent = "분류 결과가 명확하지 않습니다.";
                    classificationResult.style.color = '#dc3545'; // 오류 시 색상
                }

            } catch (error) {
                console.error('분류 요청 중 오류 발생:', error);
                classificationResult.textContent = `분류 중 오류가 발생했습니다: ${error.message}`;
                classificationResult.style.color = '#dc3545'; // 오류 시 색상
            }

        } else {
            classificationResult.textContent = "먼저 이미지를 업로드해주세요.";
            classificationResult.style.color = '#ffc107'; // 경고 시 색상
        }
    });
});