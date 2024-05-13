import cv2 as cv
import sys

face_cascade = cv.CascadeClassifier('C:/Users/tande/OneDrive/Desktop/Undemy web development/Backend/face-recognition-web/src/haar_Face.xml')
video_capture = cv.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )
    print(len(faces))
    sys.stdout.flush()

    for (x, y, w, h) in faces:
        cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv.imshow('Video', frame)

    if cv.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv.destroyAllWindows()
