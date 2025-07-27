document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const classifyBtn = document.getElementById('classifyBtn');
    const classificationResult = document.getElementById('classificationResult');

    // -------------------------------------------------------------
    // 1. 이미지 파일 업로드 처리
    // -------------------------------------------------------------
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0]; // 선택된 첫 번째 파일 가져오기
        if (file) {
            const reader = new FileReader(); // 파일을 읽기 위한 FileReader 객체 생성
            
            reader.onload = (e) => {
                // 파일 읽기가 완료되면 실행될 콜백 함수
                imagePreview.src = e.target.result; // 미리보기 이미지의 src를 읽어온 데이터 URL로 설정
                imagePreview.style.display = 'block'; // 이미지 미리보기 표시
                classifyBtn.style.display = 'block'; // '분류하기' 버튼 표시
                classificationResult.textContent = "이미지를 업로드했습니다. '분류하기' 버튼을 눌러주세요."; // 결과 메시지 초기화
            };
            
            reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기 (Base64 인코딩된 문자열)
        } else {
            // 파일이 선택되지 않은 경우
            imagePreview.src = '#';
            imagePreview.style.display = 'none'; // 미리보기 숨기기
            classifyBtn.style.display = 'none'; // 분류하기 버튼 숨기기
            classificationResult.textContent = "이미지를 선택해주세요.";
        }
    });

    // -------------------------------------------------------------
    // 2. '분류하기' 버튼 클릭 시 (백엔드 연동 예정)
    // -------------------------------------------------------------
    classifyBtn.addEventListener('click', () => {
        const imageDataUrl = imagePreview.src; // 현재 미리보기 이미지의 데이터 URL 가져오기

        if (imageDataUrl && imageDataUrl !== '#') {
            classificationResult.textContent = "이미지를 분류 중입니다...";
            
            // TODO: 나중에 여기에 백엔드 API 호출 코드가 들어갑니다.
            // 예시:
            /*
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageDataUrl }) // 이미지 데이터 URL을 JSON 형태로 전송
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 백엔드로부터 받은 분류 결과를 화면에 표시
                if (data.class_name) {
                    classificationResult.textContent = `분류 결과: ${data.class_name} (확률: ${data.confidence ? (data.confidence * 100).toFixed(2) + '%' : '알 수 없음'})`;
                } else {
                    classificationResult.textContent = "분류 결과가 명확하지 않습니다.";
                }
            })
            .catch(error => {
                console.error('분류 요청 중 오류 발생:', error);
                classificationResult.textContent = `분류 중 오류가 발생했습니다: ${error.message}`;
            });
            */

            // 현재는 백엔드가 없으므로 임시 메시지를 표시합니다.
            setTimeout(() => {
                classificationResult.textContent = "⚠️ (아직 백엔드 연동 전) 임시 결과: 플라스틱 (예측)";
            }, 1500); // 1.5초 후 메시지 표시 (분류하는 척)

        } else {
            classificationResult.textContent = "먼저 이미지를 업로드해주세요.";
        }
    });
});