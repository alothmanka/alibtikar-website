#!/usr/bin/env python3
"""
Script to add social media data to Alibtikar website database
Run this once to populate the social media category in the admin dashboard
"""

import psycopg2
import sys
from datetime import datetime

# Your database credentials
DATABASE_URL = "postgresql://alibtikar_db_user:g1qSvTzYJtcKMuQ37kDZKVzQ1wDx0qxM@dpg-d7iuu2ho3t8c73e9rdj0-a/alibtikar_db"

# Social media data to insert
SOCIAL_MEDIA_DATA = [
    {
        'contentKey': 'social.facebook',
        'valueEn': 'https://facebook.com',
        'valueAr': 'https://facebook.com',
        'category': 'social',
        'label': 'Facebook',
        'fieldType': 'url',
        'sortOrder': 1
    },
    {
        'contentKey': 'social.instagram',
        'valueEn': 'https://instagram.com',
        'valueAr': 'https://instagram.com',
        'category': 'social',
        'label': 'Instagram',
        'fieldType': 'url',
        'sortOrder': 2
    },
    {
        'contentKey': 'social.twitter',
        'valueEn': 'https://twitter.com',
        'valueAr': 'https://twitter.com',
        'category': 'social',
        'label': 'Twitter',
        'fieldType': 'url',
        'sortOrder': 3
    },
    {
        'contentKey': 'social.linkedin',
        'valueEn': 'https://linkedin.com',
        'valueAr': 'https://linkedin.com',
        'category': 'social',
        'label': 'LinkedIn',
        'fieldType': 'url',
        'sortOrder': 4
    },
    {
        'contentKey': 'social.youtube',
        'valueEn': 'https://youtube.com',
        'valueAr': 'https://youtube.com',
        'category': 'social',
        'label': 'YouTube',
        'fieldType': 'url',
        'sortOrder': 5
    }
]

def main():
    try:
        print("🔗 Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("✅ Connected successfully!")
        
        print("\n📝 Adding social media data...")
        
        for item in SOCIAL_MEDIA_DATA:
            # Check if the item already exists
            cursor.execute(
                'SELECT id FROM site_content WHERE "contentKey" = %s',
                (item['contentKey'],)
            )
            existing = cursor.fetchone()
            
            if existing:
                print(f"⏭️  Skipping {item['label']} - already exists")
                continue
            
            # Insert the item
            cursor.execute(
                '''INSERT INTO site_content 
                   ("contentKey", "valueEn", "valueAr", category, label, "fieldType", "sortOrder", "updatedAt")
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
                (
                    item['contentKey'],
                    item['valueEn'],
                    item['valueAr'],
                    item['category'],
                    item['label'],
                    item['fieldType'],
                    item['sortOrder'],
                    datetime.now()
                )
            )
            print(f"✅ Added {item['label']}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n🎉 Success! Social media data has been added to your database!")
        print("\n📋 Next steps:")
        print("1. Go to https://ibtikar-agri.sa/admin")
        print("2. Log in with Admin / @7654321")
        print("3. You should now see the 'Social Media' tab")
        print("4. Edit the URLs as you create your social media accounts")
        
    except psycopg2.Error as e:
        print(f"\n❌ Database error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
