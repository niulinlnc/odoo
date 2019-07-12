# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import _
from odoo.exceptions import UserError

import logging

_logger = logging.getLogger(__name__)
_phonenumbers_lib_warning = False


try:
    import phonenumbers

    def phone_parse(number, country_code):
        try:
            phone_nbr = phonenumbers.parse(number, region=country_code, keep_raw_input=True)
        except phonenumbers.phonenumberutil.NumberParseException as e:
            raise UserError(_('Unable to parse %s:\n%s') % (number, e))

        if not phonenumbers.is_possible_number(phone_nbr):
            raise UserError(_('Impossible number %s: probably invalid number of digits') % number)
        if not phonenumbers.is_valid_number(phone_nbr):
            raise UserError(_('Invalid number %s: probably incorrect prefix') % number)

        return phone_nbr

    def phone_format(number, country_code, country_phone_code, force_format='INTERNATIONAL', raise_exception=True):
        """ Format the given phone number according to the localisation and international options.
        :param number: number to convert
        :param country_code: the ISO country code in two chars
        :type country_code: str
        :param country_phone_code: country dial in codes, defined by the ITU-T (Ex: 32 for Belgium)
        :type country_phone_code: int
        :param force_format: stringified version of format globals (see
          https://github.com/daviddrysdale/python-phonenumbers/blob/dev/python/phonenumbers/phonenumberutil.py)
            'E164' = 0
            'INTERNATIONAL' = 1
            'NATIONAL' = 2
            'RFC3966' = 3
        :type force_format: str
        :rtype: str
        """
        try:
            phone_nbr = phone_parse(number, country_code)
        except (phonenumbers.phonenumberutil.NumberParseException, UserError) as e:
            if raise_exception:
                raise
            else:
                _logger.warning(_('Unable to format %s:\n%s'), number, e)
                return number
        if force_format == 'E164':
            phone_fmt = phonenumbers.PhoneNumberFormat.E164
        elif force_format == 'RFC3966':
            phone_fmt = phonenumbers.PhoneNumberFormat.RFC3966
        elif force_format == 'INTERNATIONAL' or phone_nbr.country_code != country_phone_code:
            phone_fmt = phonenumbers.PhoneNumberFormat.INTERNATIONAL
        else:
            phone_fmt = phonenumbers.PhoneNumberFormat.NATIONAL
        return phonenumbers.format_number(phone_nbr, phone_fmt)

except ImportError:

    def phone_parse(number, country_code):
        return False

    def phone_format(number, country_code, country_phone_code, force_format='INTERNATIONAL', raise_exception=True):
        global _phonenumbers_lib_warning
        if not _phonenumbers_lib_warning:
            _logger.warning(
                "The `phonenumbers` Python module is not installed, contact numbers will not be "
                "verified. Please install the `phonenumbers` Python module."
            )
            _phonenumbers_lib_warning = True
        return number


def phone_sanitize_numbers(numbers, country_code, country_phone_code, force_format='E164'):
    valid, invalid, void_count = [], [], 0
    for number in numbers:
        if not number:
            void_count += 1
            continue
        try:
            sanitized = phone_format(
                number, country_code, country_phone_code,
                force_format=force_format, raise_exception=True)
        except Exception as e:
            invalid.append(number)
        else:
            valid.append(sanitized)
    return valid, invalid, void_count


def phone_sanitize_numbers_w_record(numbers, country_code, country_phone_code, record, record_country_fname='country_id', force_format='E164'):
    if not country_code or not country_phone_code:
        country = False
        if record and record_country_fname in record and record[record_country_fname]:
            country = record[record_country_fname]
        elif record:
            country = record.env.company.country_id
        if country:
            country_code = country_code if country_code else country.code
            country_phone_code = country_phone_code if country_phone_code else country.phone_code
    return phone_sanitize_numbers(numbers, country_code, country_phone_code, force_format=force_format)


def phone_sanitize_numbers_string_w_record(numbers_str, country_code, country_phone_code, record, record_country_fname='country_id', force_format='E164'):
    found_numbers = [number.strip() for number in numbers_str.split(',')]
    return phone_sanitize_numbers_w_record(found_numbers, country_code, country_phone_code, record, record_country_fname, force_format=force_format)


def phone_get_sanitized_records_number(records, number_fname='mobile', country_fname='country_id', force_format='E164'):
    res = dict.fromkeys(records.ids, False)
    for record in records:
        number = record[number_fname]
        valid, invalid, void_count = phone_sanitize_numbers_w_record([number], None, None, records, country_fname,force_format=force_format)
        if valid:
            res[record.id] = valid[0]
        elif void_count:
            res[record.id] = False
        else:
            res[record.id] = False
    return res


def phone_get_sanitized_record_number(record, number_fname='mobile', country_fname='country_id', force_format='E164'):
    return phone_get_sanitized_records_number(record, number_fname, country_fname, force_format=force_format)[record.id]
