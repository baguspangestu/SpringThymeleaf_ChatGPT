package com.irvanudin.uas.models;

import java.util.Map;

public class JadwalModel {
    private int code;
    private String message;
    private Data data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private String provinsi;
        private String kabKota;
        private Map<String, DetailJadwal> data;

        public String getProvinsi() {
            return provinsi;
        }

        public void setProvinsi(String provinsi) {
            this.provinsi = provinsi;
        }

        public String getKabKota() {
            return kabKota;
        }

        public void setKabKota(String kabKota) {
            this.kabKota = kabKota;
        }

        public Map<String, DetailJadwal> getData() {
            return data;
        }

        public void setData(Map<String, DetailJadwal> data) {
            this.data = data;
        }
    }

    public static class DetailJadwal {
        private Boolean isToday = false;
        private String tanggal;
        private String imsak;
        private String subuh;
        private String terbit;
        private String dhuha;
        private String dzuhur;
        private String ashar;
        private String maghrib;
        private String isya;

        public Boolean getIsToday() {
            return isToday;
        }

        public void setIsToday(Boolean isToday) {
            this.isToday = isToday;
        }

        public String getTanggal() {
            return tanggal;
        }

        public void setTanggal(String tanggal) {
            this.tanggal = tanggal;
        }

        public String getImsak() {
            return imsak;
        }

        public void setImsak(String imsak) {
            this.imsak = imsak;
        }

        public String getSubuh() {
            return subuh;
        }

        public void setSubuh(String subuh) {
            this.subuh = subuh;
        }

        public String getTerbit() {
            return terbit;
        }

        public void setTerbit(String terbit) {
            this.terbit = terbit;
        }

        public String getDhuha() {
            return dhuha;
        }

        public void setDhuha(String dhuha) {
            this.dhuha = dhuha;
        }

        public String getDzuhur() {
            return dzuhur;
        }

        public void setDzuhur(String dzuhur) {
            this.dzuhur = dzuhur;
        }

        public String getAshar() {
            return ashar;
        }

        public void setAshar(String ashar) {
            this.ashar = ashar;
        }

        public String getMaghrib() {
            return maghrib;
        }

        public void setMaghrib(String maghrib) {
            this.maghrib = maghrib;
        }

        public String getIsya() {
            return isya;
        }

        public void setIsya(String isya) {
            this.isya = isya;
        }
    }
}
