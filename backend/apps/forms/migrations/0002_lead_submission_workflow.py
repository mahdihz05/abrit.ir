from django.db import migrations, models


FORM_DEFINITIONS = {
    "consultation": {
        "translations": {
            "fa": ("درخواست مشاوره و ارزیابی IT", "اطلاعات اولیه را ثبت کنید تا تیم ابریت برای بررسی نیاز شما تماس بگیرد.", "درخواست شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.", "با ثبت این فرم با نگهداری اطلاعات برای پیگیری درخواست موافقم."),
            "en": ("IT consultation and assessment", "Share the initial details and the AbrIT team will contact you.", "Your request has been received. We will contact you shortly.", "I agree that my information may be retained to follow up this request."),
            "ar-ae": ("طلب استشارة وتقييم تقنية المعلومات", "شارك المعلومات الأولية وسيتواصل معك فريق AbrIT.", "تم استلام طلبك وسنتواصل معك قريباً.", "أوافق على حفظ معلوماتي لمتابعة هذا الطلب."),
        },
        "fields": [
            ("full_name", "text", True, 1, 2, 120, []),
            ("phone", "phone", True, 2, 7, 25, []),
            ("email", "email", False, 3, 0, 180, []),
            ("company", "text", False, 4, 0, 160, []),
            ("company_size", "select", False, 5, None, None, ["1-10", "11-50", "51-200", "201+"]),
            ("need_type", "select", True, 6, None, None, ["assessment", "managed-it", "security", "cloud", "backup", "automation", "other"]),
            ("details", "textarea", True, 7, 10, 2000, []),
            ("preferred_contact", "select", False, 8, None, None, ["phone", "email", "whatsapp"]),
            ("context", "hidden", False, 9, 0, 200, []),
        ],
    },
    "quote-request": {
        "translations": {
            "fa": ("درخواست پیشنهاد قیمت", "ظرفیت و نیاز فعلی را ثبت کنید تا پیشنهاد مناسب دریافت کنید.", "درخواست قیمت شما ثبت شد؛ پس از بررسی با شما تماس می‌گیریم.", "با ثبت این فرم با نگهداری اطلاعات برای پیگیری درخواست موافقم."),
            "en": ("Request a proposal", "Share your current capacity and requirements to receive a suitable proposal.", "Your quote request has been received. We will contact you after review.", "I agree that my information may be retained to follow up this request."),
            "ar-ae": ("طلب عرض سعر", "شارك السعة والمتطلبات الحالية للحصول على عرض مناسب.", "تم استلام طلب عرض السعر وسنتواصل معك بعد المراجعة.", "أوافق على حفظ معلوماتي لمتابعة هذا الطلب."),
        },
        "fields": [
            ("full_name", "text", True, 1, 2, 120, []),
            ("phone", "phone", True, 2, 7, 25, []),
            ("email", "email", False, 3, 0, 180, []),
            ("company", "text", False, 4, 0, 160, []),
            ("users", "number", True, 5, None, None, []),
            ("sites", "number", False, 6, None, None, []),
            ("details", "textarea", False, 7, 0, 2000, []),
            ("package", "hidden", False, 8, 0, 100, []),
        ],
    },
}


def seed_lead_forms(apps, schema_editor):
    Form = apps.get_model("forms", "Form")
    FormTranslation = apps.get_model("forms", "FormTranslation")
    FormField = apps.get_model("forms", "FormField")
    FormFieldTranslation = apps.get_model("forms", "FormFieldTranslation")

    field_labels = {
        "fa": {"full_name": "نام و نام خانوادگی", "phone": "شماره تماس", "email": "ایمیل کاری", "company": "نام سازمان", "company_size": "اندازه سازمان", "need_type": "موضوع درخواست", "details": "نیاز یا مسئله اصلی", "preferred_contact": "روش تماس ترجیحی", "context": "زمینه درخواست", "users": "تعداد کاربران", "sites": "تعداد شعب", "package": "پکیج"},
        "en": {"full_name": "Full name", "phone": "Phone number", "email": "Work email", "company": "Organization", "company_size": "Organization size", "need_type": "Request topic", "details": "Main requirement or challenge", "preferred_contact": "Preferred contact method", "context": "Request context", "users": "Users", "sites": "Sites", "package": "Package"},
        "ar-ae": {"full_name": "الاسم الكامل", "phone": "رقم الهاتف", "email": "البريد الإلكتروني للعمل", "company": "المؤسسة", "company_size": "حجم المؤسسة", "need_type": "موضوع الطلب", "details": "المتطلب أو التحدي الرئيسي", "preferred_contact": "طريقة التواصل المفضلة", "context": "سياق الطلب", "users": "المستخدمون", "sites": "الفروع", "package": "الباقة"},
    }

    for form_key, definition in FORM_DEFINITIONS.items():
        form, _ = Form.objects.update_or_create(
            key=form_key,
            defaults={"is_active": True, "requires_privacy_consent": True, "retention_months": 12},
        )
        for locale, values in definition["translations"].items():
            FormTranslation.objects.update_or_create(
                form=form,
                locale=locale,
                defaults={"title": values[0], "description": values[1], "success_message": values[2], "consent_label": values[3]},
            )
        for key, field_type, required, order, min_length, max_length, options in definition["fields"]:
            defaults = {"field_type": field_type, "required": required, "order": order, "is_active": True, "options": options}
            if min_length is not None:
                defaults["min_length"] = min_length
            if max_length is not None:
                defaults["max_length"] = max_length
            if field_type == "number":
                defaults["min_value"] = 1
                defaults["max_value"] = 100000
            field, _ = FormField.objects.update_or_create(form=form, key=key, defaults=defaults)
            for locale in ("fa", "en", "ar-ae"):
                FormFieldTranslation.objects.update_or_create(
                    field=field,
                    locale=locale,
                    defaults={"label": field_labels[locale][key]},
                )


def remove_lead_forms(apps, schema_editor):
    apps.get_model("forms", "Form").objects.filter(key__in=FORM_DEFINITIONS).delete()


class Migration(migrations.Migration):
    dependencies = [("forms", "0001_initial")]

    operations = [
        migrations.AddField(model_name="formsubmission", name="status", field=models.CharField(choices=[("new", "New"), ("contacted", "Contacted"), ("qualified", "Qualified"), ("closed", "Closed")], db_index=True, default="new", max_length=16)),
        migrations.AddField(model_name="formsubmission", name="source_url", field=models.URLField(blank=True, max_length=500)),
        migrations.AddField(model_name="formsubmission", name="referrer", field=models.URLField(blank=True, max_length=500)),
        migrations.AddField(model_name="formsubmission", name="internal_notes", field=models.TextField(blank=True)),
        migrations.AddIndex(model_name="formsubmission", index=models.Index(fields=["form", "-created_at"], name="forms_sub_form_created_idx")),
        migrations.AddIndex(model_name="formsubmission", index=models.Index(fields=["locale", "-created_at"], name="forms_sub_locale_created_idx")),
        migrations.RunPython(seed_lead_forms, remove_lead_forms),
    ]
