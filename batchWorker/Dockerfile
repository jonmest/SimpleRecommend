FROM python:3.7

WORKDIR /computer/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=0

CMD ["python", "-u", "./main.py"]