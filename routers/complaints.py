from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import models
import schemas
from database import get_db
from routers.auth import get_current_user

# Create an APIRouter specifically for all /complaints URLs
# We add a GLOBAL dependency, meaning EVERY endpoint below requires a valid JWT Token!
router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
    dependencies=[Depends(get_current_user)]
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    new_complaint = models.DBComplaint(
        student_name=complaint.student_name,
        room_number=complaint.room_number,
        category=complaint.category,
        description=complaint.description
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return {"message": "Complaint registered!", "complaint": new_complaint}

@router.get("/{complaint_id}")
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(models.DBComplaint).filter(models.DBComplaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return complaint

@router.get("/status/{status_val}")
def get_complaints_by_status(status_val: str, db: Session = Depends(get_db)):
    matching_complaints = db.query(models.DBComplaint).filter(models.DBComplaint.status == status_val).all()
    return {"status": status_val, "complaints": matching_complaints, "total": len(matching_complaints)}

@router.get("")
def get_all_complaints(db: Session = Depends(get_db)):
    all_complaints = db.query(models.DBComplaint).all()
    return {"complaints": all_complaints, "total": len(all_complaints)}

@router.put("/{complaint_id}/status")
def update_status(complaint_id: int, new_status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update complaint status")

    complaint = db.query(models.DBComplaint).filter(models.DBComplaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    complaint.status = new_status
    if new_status == "resolved":
        complaint.resolved_at = datetime.now().isoformat()
        
    db.commit()
    db.refresh(complaint)
    return {"message": "Status updated successfully", "complaint": complaint}

@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(models.DBComplaint).filter(models.DBComplaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
        
    db.delete(complaint)
    db.commit()
    return {"message": "Complaint strictly deleted", "complaint": complaint}
