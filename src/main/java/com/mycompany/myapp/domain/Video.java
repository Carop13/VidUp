package com.mycompany.myapp.domain;


import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Video.
 */
@Entity
@Table(name = "video")
public class Video implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Lob
    @Column(name = "upload_video", nullable = false)
    private byte[] uploadVideo;

    @Column(name = "upload_video_content_type", nullable = false)
    private String uploadVideoContentType;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @NotNull
    @Column(name = "author", nullable = false)
    private String author;

    @ManyToOne
    @NotNull
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getUploadVideo() {
        return uploadVideo;
    }

    public void setUploadVideo(byte[] uploadVideo) {
        this.uploadVideo = uploadVideo;
    }

    public String getUploadVideoContentType() {
        return uploadVideoContentType;
    }

    public void setUploadVideoContentType(String uploadVideoContentType) {
        this.uploadVideoContentType = uploadVideoContentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Video video = (Video) o;
        if(video.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, video.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Video{" +
            "id=" + id +
            ", uploadVideo='" + uploadVideo + "'" +
            ", uploadVideoContentType='" + uploadVideoContentType + "'" +
            ", title='" + title + "'" +
            ", description='" + description + "'" +
            ", createdDate='" + createdDate + "'" +
            ", author='" + author + "'" +
            '}';
    }
}
