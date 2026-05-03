import psycopg2
from datetime import datetime

conn = psycopg2.connect(
    "postgresql://alibtikar_db_user:g1qSvTzYJtcKMuQ37kDZKVzQ1wDx0qxM@dpg-d7iuu2ho3t8c73e9rdj0-a.singapore-postgres.render.com:5432/alibtikar_db",
    sslmode='require'
)

cursor = conn.cursor()

print("Adding second phone number...")

cursor.execute(
    '''INSERT INTO site_content 
       ("contentKey", "valueEn", "valueAr", category, label, "fieldType", "sortOrder", "updatedAt")
       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
    (
        'contact.phone2',
        '+966654423988',
        '+966654423988',
        'contact',
        'Phone Number 2',
        'phone',
        3,
        datetime.now()
    )
)

conn.commit()
cursor.close()
conn.close()

print("✅ Second phone number added!")
